import { InjectionToken } from '@angular/core';
import { DEFAULT_DATE_ADAPTERS, DateAdapterRegistration } from '../adapters/consts';

export const DATE_ADAPTERS = new InjectionToken<DateAdapterRegistration[]>('ngx-date-adapters', {
  factory: () => DEFAULT_DATE_ADAPTERS,
});
