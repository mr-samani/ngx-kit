import { InjectionToken } from '@angular/core';

export const NGX_CALENDAR_LOCALIZATION = new InjectionToken<NgxCalendarLocalization>(
  'ngx-calendar-localization',
  {
    factory: () => DEFAULT_NGX_CALENDAR_LOCALIZATION,
  },
);

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
export const DEFAULT_NGX_CALENDAR_LOCALIZATION = new NgxCalendarLocalization();
