import { Signal, assertInInjectionContext, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import type { Params, TranslateFn } from '../types/types';

/** `readonly title = translateSignal('orders.title')`  (injection context) */
export function translateSignal(key: string, params?: Params | (() => Params)): Signal<string> {
  assertInInjectionContext(translateSignal);
  return inject(I18nService).select(key, params);
}

/** `const t = injectT();  computed(() => t('a.b'))` — reactive translate function. */
export function injectT(): TranslateFn {
  assertInInjectionContext(injectT);
  const svc = inject(I18nService);
  return (key, params) => svc.t(key, params);
}
