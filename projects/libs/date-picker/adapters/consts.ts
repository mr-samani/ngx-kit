import { inject, InjectionToken, Type } from '@angular/core';
import { IDateAdapter } from './IAdapter';
import { GregorianAdapter } from './locales/gregorian.adapter';
import { JalaliAdapter } from './locales/jalali-adapter';

// export declare type Locale = 'fa' | 'en' | 'ar' | 'he' | 'zh';

export const DATE_ADAPTERS = new InjectionToken<DateAdapterRegistration[]>('DATE_ADAPTERS');

export interface DateAdapterRegistration {
  locale: string;

  useClass: Type<IDateAdapter>;
}

export const DEFAULT_DATE_ADAPTERS: readonly DateAdapterRegistration[] = Object.freeze([
  { locale: 'en', useClass: GregorianAdapter },
  { locale: 'fa', useClass: JalaliAdapter },
]);

export function getLocals(): string[] {
  const adapters = inject<DateAdapterRegistration[]>(DATE_ADAPTERS);

  return adapters.map((m) => m.locale);
}
