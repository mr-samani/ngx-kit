import { InjectionToken, Type } from '@angular/core';
import type { Observable } from 'rxjs';

/** A (possibly nested) translation file as returned by the server. */
export interface Dictionary {
  [key: string]: string | number | boolean | null | Dictionary | Array<unknown>;
}
export type Params = Record<string, unknown>;
export type TranslateFn = (key: string, params?: Params) => string;
export type MissingHandler = (key: string, lang: string) => string;
export type Transpiler = (value: string, params: Params | undefined, lang: string) => string;

export interface I18nLoader {
  /** `scope === undefined` means the global file. */
  load(lang: string, scope?: string): Observable<Dictionary> | Promise<Dictionary>;
}

/**
 * Every option is optional so the library can be provided at startup and completed later
 * (for example after your own APP_INITIALIZER has fetched the language list from the backend):
 * see `I18nService.init()` / `I18nService.configure()`.
 */
export interface I18nConfig {
  /** All supported languages. Required before the first language is activated. */
  langs?: string[];
  /** Language used when nothing is stored or detected. Required before the first language is activated. */
  defaultLang?: string;
  /** Looked up (in order) when a key is empty/missing in the active language. */
  fallbackLangs?: string[];
  /** Default `'key'` (returns the key itself). */
  missing?: 'key' | 'empty' | MissingHandler;
  /** Log each missing key once. Default: `isDevMode()`. */
  warnMissing?: boolean;
  /** Replace the default `{{ name }}` interpolation (ICU, plurals, ...). */
  transpile?: Transpiler;
  /** Custom loader class (must be `@Injectable({providedIn:'root'})` or constructible without args). Default: HTTP. Provide-time only. */
  loader?: Type<I18nLoader>;
  /** Default HTTP loader: base URL. Default `'/i18n'` -> `/i18n/fa.json`, `/i18n/setting/fa.json`. Slashes are normalised. */
  baseUrl?: string;
  /** Default HTTP loader: file extension appended to the URL, e.g. `'.json'`. Default `'.json'`; use `''` for none. */
  fileExtension?: string;
  /** Default HTTP loader: full control over the URL. */
  url?: (lang: string, scope?: string) => string;
  /** Retries per failed request. Default `1`. */
  retries?: number;
  /** localStorage key used to remember the language. `null` disables. Default `'lazy-i18n.lang'`. */
  storageKey?: string | null;
  /** Pick the initial language from `navigator.languages` when nothing is stored. Default `false`. */
  detectBrowserLang?: boolean;
  /** Keep `<html lang dir>` in sync. Default `true`. */
  manageDocument?: boolean;
  /**
   * Activate the initial language in an APP_INITIALIZER created by `provideI18n()`.
   * Default: `true` when both `langs` and `defaultLang` are given to `provideI18n()`, otherwise `false`
   * (then you call `I18nService.init()` yourself, typically from your own initializer).
   * Provide-time only.
   */
  autoInit?: boolean;
}

/** Options that can be changed after the app has started. */
export type I18nRuntimeConfig = Omit<I18nConfig, 'loader' | 'autoInit'>;

/** `I18nService.init()` options: runtime config + the language to start with. */
export interface I18nInitOptions extends I18nRuntimeConfig {
  /** Preferred starting language (e.g. the user's saved language from the backend). Ignored if not in `langs`. */
  lang?: string;
}

/** Defaults applied by `provideI18n()`. */
export const I18N_DEFAULTS: I18nConfig = { fileExtension: '.json', retries: 1 };

export const I18N_CONFIG = new InjectionToken<I18nConfig>('I18N_CONFIG');
export const I18N_LOADER = new InjectionToken<I18nLoader>('I18N_LOADER');
