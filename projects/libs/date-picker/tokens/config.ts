import { InjectionToken, TemplateRef } from '@angular/core';
import type { DateAdapterRegistration } from '../adapters/consts';
export class NgxCalendarLocalization {
  clear = 'Clear';
  today = 'Today';

  /** Range picker labels. */
  rangeStart = 'Start date';
  rangeEnd = 'End date';

  day = 'Day';
  month = 'Month';
  week = 'Week';
  year = 'Year';
  event = 'Event';
}
export class NgxDateConfig {
  localization?: NgxCalendarLocalization = new NgxCalendarLocalization();
  previousButtonTemplate?: TemplateRef<any>;
  nextButtonTemplate?: TemplateRef<any>;
  caretDownIconTemplate?: TemplateRef<any>;

  todayButton?: boolean = true;
  clearButton?: boolean = true;

  locale?: string = 'en';

  adapters?: DateAdapterRegistration[];
}

export const DEFAULT_DATE_CONFIG = new NgxDateConfig();
export const NGX_DATE_CONFIG = new InjectionToken<NgxDateConfig>('ngx-kit-date-config', {
  factory: () => DEFAULT_DATE_CONFIG,
});
