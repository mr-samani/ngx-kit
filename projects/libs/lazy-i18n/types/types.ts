import { InjectionToken, Type } from '@angular/core';
import type { Observable } from 'rxjs';
import { HttpI18nLoader } from '../public-api';

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

export class I18nConfig {
  /** All supported languages. */
  langs!: string[];
  defaultLang!: string;
  /** Looked up (in order) when a key is empty/missing in the active language. */
  fallbackLangs?: string[];
  /** Default `'key'` (returns the key itself). */
  missing?: 'key' | 'empty' | MissingHandler;
  /** Log each missing key once. Default: `isDevMode()`. */
  warnMissing?: boolean;
  /** Replace the default `{{ name }}` interpolation (ICU, plurals, ...). */
  transpile?: Transpiler;
  /** Custom loader class (must be `@Injectable({providedIn:'root'})` or constructible without args). Default: HTTP. */
  loader?: Type<I18nLoader> = HttpI18nLoader;
  /** Default HTTP loader: base URL. Default `'/i18n'` -> `/i18n/fa`, `/i18n/setting/fa`. */
  baseUrl?: string;
  /** Default HTTP loader: file extension appended to the URL, e.g. `'.json'`. Default `'.json'`. */
  fileExtension?: string = '.json';
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
}

export const I18N_CONFIG = new InjectionToken<I18nConfig>('I18N_CONFIG');
export const I18N_LOADER = new InjectionToken<I18nLoader>('I18N_LOADER');
