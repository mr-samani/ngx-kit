import { EnvironmentProviders, inject, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import type { CanActivateChildFn } from '@angular/router';
import { I18nService } from '../services/i18n.service';

/**
 * Put in `route.providers`. Runs when the route injector is created (before guards),
 * so loading starts as early as possible. Child routes need nothing.
 */
export function provideI18nScope(scope: string | string[]): EnvironmentProviders {
  const scopes = Array.isArray(scope) ? scope : [scope];
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      const svc = inject(I18nService);
      for (const s of scopes) svc.registerScope(s);
    }),
  ]);
}

/** Put ONCE on the root path-less route: `canActivateChild: [i18nReadyGuard]`. Waits for every registered scope. */
export const i18nReadyGuard: CanActivateChildFn = async () => {
  await inject(I18nService).whenReady();
  return true;
};
