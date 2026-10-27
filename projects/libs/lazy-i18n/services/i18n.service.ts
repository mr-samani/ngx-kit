import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, computed, inject, isDevMode, signal } from '@angular/core';
import { defer, firstValueFrom, from, retry } from 'rxjs';
import {
  I18N_CONFIG,
  I18N_LOADER,
  type Dictionary,
  type I18nInitOptions,
  type I18nRuntimeConfig,
  type Params,
} from '../types/types';
import { RTL_LANGS, assignDefined, flatten, interpolate } from '../utils/utils';

const TAG = '[lazy-i18n]';
const EMPTY: readonly string[] = [];

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly cfg = inject(I18N_CONFIG);
  private readonly loader = inject(I18N_LOADER);
  private readonly doc = inject(DOCUMENT);

  private readonly _lang = signal(this.cfg.defaultLang ?? '');
  private readonly _rev = signal(0);
  private readonly _langs = signal<readonly string[]>(this.cfg.langs ?? EMPTY);
  private readonly _ready = signal(false);
  /** Active language (reactive). */
  readonly lang = this._lang.asReadonly();
  /** Bumps whenever the active language or any dictionary changes. */
  readonly revision = this._rev.asReadonly();
  readonly dir = computed<'rtl' | 'ltr'>(() =>
    RTL_LANGS.has(this._lang().split('-')[0]) ? 'rtl' : 'ltr',
  );
  /** Supported languages (a signal: they may be supplied after startup via `init()` / `configure()`). */
  readonly langs = this._langs.asReadonly();
  /** `true` once the first language has been activated. Handy for a splash screen. */
  readonly ready = this._ready.asReadonly();

  // read live, so values supplied later through configure() are honoured
  private get fallbacks(): readonly string[] {
    return this.cfg.fallbackLangs ?? EMPTY;
  }
  private get warn(): boolean {
    return this.cfg.warnMissing ?? isDevMode();
  }
  private readonly dicts = new Map<string, Map<string, string>>(); // lang -> flat map
  private readonly loaded = new Set<string>(); // `${lang}|${scope}`
  private readonly inflight = new Map<string, Promise<void>>();
  private readonly scopes = new Set<string>();
  private readonly pending = new Set<Promise<void>>();
  private readonly warned = new Set<string>();
  private useToken = 0;

  // ───────────────────────── translate ─────────────────────────

  /** Translate. Reads signals, so it is reactive inside `computed`, `effect` and templates. */
  t(key: string, params?: Params): string {
    this._rev();
    return this.resolve(key, params, this._lang());
  }

  /** Same as `t`, but never creates a reactive dependency. */
  instant(key: string, params?: Params): string {
    return this.resolve(key, params, this._lang());
  }

  /** `computed` signal for one key. `params` may be a function reading other signals. */
  select(key: string, params?: Params | (() => Params)): Signal<string> {
    return computed(() => this.t(key, typeof params === 'function' ? params() : params));
  }

  /** True when the key has a non-empty value in the active language or a fallback. */
  has(key: string): boolean {
    this._rev();
    return this.lookup(key, this._lang()) !== undefined;
  }

  /** Returns every key below `prefix` as a nested object (values are raw, not interpolated). */
  getObject(prefix: string): Dictionary {
    this._rev();
    const out: Dictionary = {};
    const p = prefix + '.';
    for (const lang of [this._lang(), ...this.fallbacks]) {
      for (const [k, v] of this.dicts.get(lang) ?? []) {
        if (!k.startsWith(p) || !v) continue;
        const parts = k.slice(p.length).split('.');
        let cur: any = out;
        for (let i = 0; i < parts.length - 1; i++)
          cur = typeof cur[parts[i]] === 'object' ? cur[parts[i]] : (cur[parts[i]] = {});
        if (!(parts[parts.length - 1] in cur)) cur[parts[parts.length - 1]] = v;
      }
    }
    return out;
  }

  private lookup(key: string, lang: string): string | undefined {
    let raw = this.dicts.get(lang)?.get(key);
    if (raw) return raw;
    for (const fb of this.fallbacks) {
      if (fb === lang) continue;
      raw = this.dicts.get(fb)?.get(key);
      if (raw) return raw;
    }
    return undefined; // '' (extractor placeholder) counts as missing -> falls back
  }

  private resolve(key: string, params: Params | undefined, lang: string): string {
    const raw = this.lookup(key, lang);
    if (raw === undefined) return this.onMissing(key, lang);
    return this.cfg.transpile ? this.cfg.transpile(raw, params, lang) : interpolate(raw, params);
  }

  private onMissing(key: string, lang: string): string {
    if (this.warn && this.dicts.has(lang) && !this.warned.has(key)) {
      this.warned.add(key);
      console.warn(`${TAG} Missing translation "${key}" (lang: ${lang})`);
    }
    const h = this.cfg.missing ?? 'key';
    return typeof h === 'function' ? h(key, lang) : h === 'empty' ? '' : key;
  }

  // ───────────────────────── language ─────────────────────────

  /**
   * Load global + all registered scopes (and fallback languages) for `lang`, THEN activate it.
   * Nothing renders half-translated and no "missing" flash occurs.
   */
  use(lang: string): Promise<void> {
    const p = this.activate(lang);
    // tracked so whenReady() / i18nReadyGuard also wait for an in-flight language change
    const tracked: Promise<void> = p
      .then(
        () => undefined,
        () => undefined,
      )
      .then(() => {
        this.pending.delete(tracked);
      });
    this.pending.add(tracked);
    return p;
  }

  /**
   * Complete the configuration and activate the first language in one call. Use it from your own
   * APP_INITIALIZER when the language list is only known at runtime (e.g. from the backend):
   *
   * ```ts
   * await i18n.init({ langs: ['fa', 'en'], defaultLang: 'fa', baseUrl: apiUrl, lang: user.lang });
   * ```
   * `lang` is used when it is in `langs`; otherwise stored > browser (opt-in) > `defaultLang`.
   * Rejects when the files cannot be loaded, so the initializer can show an error page.
   */
  init(options: I18nInitOptions = {}): Promise<void> {
    const { lang, ...patch } = options;
    this.configure(patch);
    const wanted =
      lang && (this.cfg.langs ?? EMPTY).includes(lang) ? lang : this.detectInitialLang();
    return this.use(wanted);
  }

  /**
   * Update options after startup (languages, baseUrl, fallbacks, ...). Already downloaded files stay cached.
   * `loader` and `autoInit` can only be set in `provideI18n()`.
   */
  configure(patch: I18nRuntimeConfig): void {
    assignDefined(this.cfg, patch);
    this.syncLangs();
    if (patch.defaultLang && !this._ready()) this._lang.set(patch.defaultLang);
  }

  private syncLangs(): void {
    const l = this.cfg.langs ?? EMPTY;
    if (l !== this._langs()) this._langs.set(l);
  }

  private async activate(lang: string): Promise<void> {
    this.syncLangs();
    const langs = this.cfg.langs ?? EMPTY;
    if (!langs.length) {
      throw new Error(
        `${TAG} No languages configured. Pass "langs" to provideI18n() or call I18nService.init({ langs, defaultLang }) first.`,
      );
    }
    if (!langs.includes(lang)) throw new Error(`${TAG} Unsupported language "${lang}"`);
    const token = ++this.useToken;
    do {
      await this.loadLang(lang);
    } while (!this.isComplete(lang)); // a scope may have been registered meanwhile
    if (token !== this.useToken) return; // a newer use() won
    this._lang.set(lang);
    this._rev.update((v) => v + 1);
    this._ready.set(true);
    this.persist(lang);
    this.applyDocument(lang);
  }

  /** Download a language without activating it. */
  preload(lang: string): Promise<void> {
    return this.loadLang(lang);
  }

  /** Language to start with: stored > browser (opt-in) > default. */
  detectInitialLang(): string {
    const langs = this.cfg.langs ?? EMPTY;
    const key = this.storageKey();
    try {
      const s = key ? localStorage.getItem(key) : null;
      if (s && langs.includes(s)) return s;
    } catch {
      /* storage unavailable (SSR / privacy mode) */
    }
    if (this.cfg.detectBrowserLang && typeof navigator !== 'undefined') {
      for (const n of navigator.languages ?? [navigator.language]) {
        if (langs.includes(n)) return n;
        const base = n.split('-')[0];
        if (langs.includes(base)) return base;
      }
    }
    const def = this.cfg.defaultLang ?? '';
    return langs.includes(def) ? def : (langs[0] ?? def);
  }

  // ───────────────────────── scopes ─────────────────────────

  /** Register a scope and start loading it for the active language. Idempotent. Used by `provideI18nScope`. */
  registerScope(scope: string): void {
    if (!scope) return;
    this.scopes.add(scope);
    // before the first activation only remember it: init()/use() loads every registered scope
    if (!this._ready()) return;
    const lang = this._lang();
    const p: Promise<void> = Promise.all(
      [lang, ...this.fallbacks.filter((f) => f !== lang)].map((l) =>
        this.fetch(l, scope).catch((e) => {
          console.error(`${TAG} Failed to load scope "${scope}" (${l})`, e);
        }),
      ),
    ).then(() => {
      this.pending.delete(p);
    });
    this.pending.add(p);
  }

  /** Resolves once every scope registered so far is available. Never rejects. */
  async whenReady(): Promise<void> {
    while (this.pending.size) await Promise.all([...this.pending]);
  }

  // ───────────────────────── data ─────────────────────────

  /** Manually set translations (tests, SSR transfer state, ...). */
  setTranslation(lang: string, dict: Dictionary, merge = true): void {
    if (!merge) this.dicts.delete(lang);
    this.merge(lang, dict);
  }

  private merge(lang: string, dict: Dictionary): void {
    let m = this.dicts.get(lang);
    if (!m) this.dicts.set(lang, (m = new Map()));
    flatten(
      dict,
      m,
      this.warn
        ? (k) => console.warn(`${TAG} Key "${k}" is defined twice with different values (${lang})`)
        : undefined,
    );
    this._rev.update((v) => v + 1);
  }

  private fetch(lang: string, scope?: string): Promise<void> {
    scope = scope || undefined; // never hand '' / null to a loader
    const id = `${lang}|${scope ?? ''}`;
    if (this.loaded.has(id)) return Promise.resolve();
    let p = this.inflight.get(id);
    if (!p) {
      p = firstValueFrom(
        defer(() => from(this.loader.load(lang, scope))).pipe(
          retry({ count: this.cfg.retries ?? 1, delay: 250 }),
        ),
      )
        .then((d) => {
          this.merge(lang, d);
          this.loaded.add(id);
        })
        .finally(() => this.inflight.delete(id));
      this.inflight.set(id, p);
    }
    return p;
  }

  private loadLang(lang: string): Promise<void> {
    const scopes: Array<string | undefined> = [undefined, ...this.scopes];
    const main = scopes.map((s) => this.fetch(lang, s));
    const fb = this.fallbacks
      .filter((f) => f !== lang)
      .flatMap((f) =>
        scopes.map((s) =>
          this.fetch(f, s).catch((e) => console.error(`${TAG} Fallback "${f}" failed`, e)),
        ),
      );
    return Promise.all([...main, ...fb]).then(() => undefined);
  }

  private isComplete(lang: string): boolean {
    return (
      this.loaded.has(`${lang}|`) && [...this.scopes].every((s) => this.loaded.has(`${lang}|${s}`))
    );
  }

  private storageKey(): string | null {
    return this.cfg.storageKey === undefined ? 'lazy-i18n.lang' : this.cfg.storageKey;
  }

  private persist(lang: string): void {
    const key = this.storageKey();
    try {
      if (key) localStorage.setItem(key, lang);
    } catch {
      /* ignore */
    }
  }

  private applyDocument(lang: string): void {
    if (this.cfg.manageDocument === false) return;
    const el = this.doc?.documentElement;
    if (!el) return;
    el.setAttribute('lang', lang);
    el.setAttribute('dir', this.dir());
  }
}
