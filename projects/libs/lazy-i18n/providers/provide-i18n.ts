import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { HttpI18nLoader } from '../loader/http-loader';
import { I18nService } from '../services/i18n.service';
import { I18N_CONFIG, I18N_DEFAULTS, I18N_LOADER, I18nConfig } from '../types/types';
import { assignDefined } from '../utils/utils';

/**
 * Static configuration (everything known at build time):
 * ```ts
 * provideHttpClient(),
 * provideI18n({ langs: ['fa', 'en'], defaultLang: 'fa', fallbackLangs: ['en'] })
 * ```
 * The global dictionary of the initial language is then loaded before the app starts.
 *
 * Deferred configuration (languages come from your backend): omit `langs`/`defaultLang`
 * and call `await inject(I18nService).init({ langs, defaultLang, baseUrl, lang })`
 * from your own APP_INITIALIZER once you know them:
 * ```ts
 * provideI18n({ fallbackLangs: ['fa'] }),              // no automatic initializer
 * provideAppInitializer(() => AppInitializer()),       // calls i18n.init(...)
 * ```
 * Pass `autoInit: false` to force this mode even when `langs` is given.
 */
export function provideI18n(config: I18nConfig = {}): EnvironmentProviders {
  const autoInit = config.autoInit ?? (!!config.langs?.length && !!config.defaultLang);
  return makeEnvironmentProviders([
    // a fresh, mutable object per injector (the service updates it through configure())
    { provide: I18N_CONFIG, useFactory: () => assignDefined({ ...I18N_DEFAULTS }, config) },
    ...(config.loader ? [config.loader] : []),
    { provide: I18N_LOADER, useFactory: () => inject(config.loader ?? HttpI18nLoader) },
    ...(autoInit
      ? [
          provideAppInitializer(() => {
            const svc = inject(I18nService);
            return svc.use(svc.detectInitialLang());
          }),
        ]
      : []),
  ]);
}
