import { inject, InjectionToken, Type } from '@angular/core';
import { IDateAdapter } from './IAdapter';
import { GregorianAdapter } from './locales/gregorian.adapter';
import { JalaliAdapter } from './locales/jalali-adapter';
import { HijriAdapter } from './locales/hijri-adapter';
import { ChineseAdapter } from './locales/chinese.adapter';
import { DATE_ADAPTERS } from '../tokens/adapters';
export const DEFAULT_DATE_ADAPTERS: DateAdapterRegistration[] = [
  { locale: 'en', useClass: GregorianAdapter },
  { locale: 'fa', useClass: JalaliAdapter },
  { locale: 'hi', useClass: HijriAdapter },
  { locale: 'zh', useClass: ChineseAdapter },
];



export interface DateAdapterRegistration {
  locale: string;

  useClass: Type<IDateAdapter>;
}

export function getLocals(): string[] {
  const adapters = inject<DateAdapterRegistration[]>(DATE_ADAPTERS);

  return adapters.map((m) => m.locale);
}

export type DateFormatPreset = 'full' | 'long' | 'medium' | 'short';

export type DateFormat = string;

export type FormatType = DateFormatPreset | DateFormat;
