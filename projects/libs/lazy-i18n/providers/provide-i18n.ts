import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { HttpI18nLoader } from '../loader/http-loader';
import { I18nService } from '../services/i18n.service';
import { I18N_CONFIG, I18N_LOADER, I18nConfig } from '../types/types';

/**
 * ```ts
 * provideHttpClient(),
 * provideI18n({ langs: ['fa', 'en'], defaultLang: 'fa', fallbackLangs: ['en'] })
 * ```
 * The global dictionary of the initial language is loaded before the app starts.
 */
export function provideI18n(config: I18nConfig): EnvironmentProviders {
  const c = { ...new I18nConfig(), ...config };
  return makeEnvironmentProviders([
    { provide: I18N_CONFIG, useValue: c },
    ...(c.loader ? [c.loader] : []),
    { provide: I18N_LOADER, useFactory: () => inject(c.loader ?? HttpI18nLoader) },
    provideAppInitializer(() => {
      const svc = inject(I18nService);
      return svc.use(svc.detectInitialLang());
    }),
  ]);
}
