import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, computed, inject, isDevMode, signal } from '@angular/core';
import { defer, firstValueFrom, from, retry } from 'rxjs';
import { I18N_CONFIG, I18N_LOADER, type Dictionary, type Params } from '../types/types';
import { RTL_LANGS, flatten, interpolate } from '../utils/utils';

const TAG = '[lazy-i18n]';
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly cfg = inject(I18N_CONFIG);
  private readonly loader = inject(I18N_LOADER);
  private readonly doc = inject(DOCUMENT);

  private readonly _lang = signal(this.cfg.defaultLang);
  private readonly _rev = signal(0);
  /** Active language (reactive). */
  readonly lang = this._lang.asReadonly();
  /** Bumps whenever the active language or any dictionary changes. */
  readonly revision = this._rev.asReadonly();
  readonly dir = computed<'rtl' | 'ltr'>(() =>
    RTL_LANGS.has(this._lang().split('-')[0]) ? 'rtl' : 'ltr',
  );
  readonly langs: readonly string[] = this.cfg.langs;

  private readonly fallbacks = this.cfg.fallbackLangs ?? [];
  private readonly warn = this.cfg.warnMissing ?? isDevMode();
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
  async use(lang: string): Promise<void> {
    if (!this.cfg.langs.includes(lang)) throw new Error(`${TAG} Unsupported language "${lang}"`);
    const token = ++this.useToken;
    do {
      await this.loadLang(lang);
    } while (!this.isComplete(lang)); // a scope may have been registered meanwhile
    if (token !== this.useToken) return; // a newer use() won
    this._lang.set(lang);
    this._rev.update((v) => v + 1);
    this.persist(lang);
    this.applyDocument(lang);
  }

  /** Download a language without activating it. */
  preload(lang: string): Promise<void> {
    return this.loadLang(lang);
  }

  /** Language to start with: stored > browser (opt-in) > default. */
  detectInitialLang(): string {
    const key = this.storageKey();
    try {
      const s = key ? localStorage.getItem(key) : null;
      if (s && this.cfg.langs.includes(s)) return s;
    } catch {
      /* storage unavailable (SSR / privacy mode) */
    }
    if (this.cfg.detectBrowserLang && typeof navigator !== 'undefined') {
      for (const n of navigator.languages ?? [navigator.language]) {
        if (this.cfg.langs.includes(n)) return n;
        const base = n.split('-')[0];
        if (this.cfg.langs.includes(base)) return base;
      }
    }
    return this.cfg.defaultLang;
  }

  // ───────────────────────── scopes ─────────────────────────

  /** Register a scope and start loading it for the active language. Idempotent. Used by `provideI18nScope`. */
  registerScope(scope: string): void {
    this.scopes.add(scope);
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
