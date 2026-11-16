import { InjectionToken, TemplateRef } from '@angular/core';
import type { DateAdapterRegistration } from '../adapters/consts';

/** '' is inherits from site */
export type NgxDateTheme = 'light' | 'dark' | 'auto' | '';

export class NgxCalendarLocalization {
  clear = 'Clear';
  done = 'Done';
  today = 'Today';

  /** Range picker labels. */
  rangeStart = 'Start date';
  rangeEnd = 'End date';
  dateRange = 'Date range';
  selectDate = 'Select a date';
  selectDateRange = 'Select date range';

  day = 'Day';
  month = 'Month';
  week = 'Week';
  year = 'Year';
  event = 'Event';

  previous = 'Previous';
  next = 'Next';
  selectMonth = 'Select month';
  selectYear = 'Select year';
  allDay = 'All day';
  noEvents = 'No events for this month.';
  untitledEvent = 'Untitled event';
}
export class NgxDateConfig {
  localization?: Partial<NgxCalendarLocalization> = new NgxCalendarLocalization();
  previousButtonTemplate?: TemplateRef<any>;
  nextButtonTemplate?: TemplateRef<any>;
  caretDownIconTemplate?: TemplateRef<any>;

  todayButton?: boolean = true;
  clearButton?: boolean = true;

  locale?: string = 'en';
  theme?: NgxDateTheme = '';

  adapters?: DateAdapterRegistration[];
}

export const DEFAULT_DATE_CONFIG = new NgxDateConfig();
export const NGX_DATE_CONFIG = new InjectionToken<NgxDateConfig>('ngx-kit-date-config', {
  factory: () => DEFAULT_DATE_CONFIG,
});
