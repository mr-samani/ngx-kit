import { inject, InjectionToken, Type } from '@angular/core';
import { IDateAdapter } from './IAdapter';
import { GregorianAdapter } from './locales/gregorian.adapter';
import { JalaliAdapter } from './locales/jalali-adapter';
import { HijriAdapter } from './locales/hijri-adapter';
import { ChineseAdapter } from './locales/chinese.adapter';

export const DATE_ADAPTERS = new InjectionToken<DateAdapterRegistration[]>('DATE_ADAPTERS');

export interface DateAdapterRegistration {
  locale: string;

  useClass: Type<IDateAdapter>;
}

export const DEFAULT_DATE_ADAPTERS: readonly DateAdapterRegistration[] = Object.freeze([
  { locale: 'en', useClass: GregorianAdapter },
  { locale: 'fa', useClass: JalaliAdapter },
  { locale: 'hi', useClass: HijriAdapter },
  { locale: 'zh', useClass: ChineseAdapter },
]);

export function getLocals(): string[] {
  const adapters = inject<DateAdapterRegistration[]>(DATE_ADAPTERS);

  return adapters.map((m) => m.locale);
}
