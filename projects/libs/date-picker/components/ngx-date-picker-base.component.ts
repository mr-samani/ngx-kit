import { clampDate, compareDate, deserialize, sameDate } from '../helpers/date.helper';
import { IDateAdapter } from '../adapters/IAdapter';
import { CalendarDate } from '../adapters/calendar-date';
import { MsEvents, MsEventViewer } from '../models/events';
import { DateAdapterRegistry } from '../adapters/date-adapter-registry';
import { computed, Directive, effect, inject, input, model, signal } from '@angular/core';
import { CalendarView, DatePickerView } from '../models/view';
import { DateViewDay, DateViewMonth, DateViewWeek, DateViewYear } from '../models/date';
import { convertNumberToTime } from '../helpers/time.helper';
import { shiftYearMonth } from '../helpers/calendar-nav.helper';
import {
  NGX_DATE_CONFIG,
  NgxCalendarLocalization,
  NgxDateConfig,
  NgxDateTheme,
} from '../tokens/config';

/** Number of years shown on one page of the year picker (4 columns x 5 rows). */
export const YEARS_PER_PAGE = 20;
/** The month grid always has six rows so the picker never changes height. */
export const MONTH_GRID_CELLS = 42;

@Directive({
  host: {
    '[attr.data-theme]': 'theme()',
  },
})
export abstract class NgxDatePickerBase {
  protected readonly _config = inject(NGX_DATE_CONFIG);

  readonly locale = input<string>(this._config.locale ?? 'en');

  /** `light`, `dark` or `auto` (follows the page / OS colour scheme). */
  readonly theme = input<NgxDateTheme>(this._config.theme ?? 'auto');

  /** Optional overrides of the built-in labels (merged over the config labels). */
  readonly localize = input<Partial<NgxCalendarLocalization> | null | undefined>(null);

  readonly config = model<NgxDateConfig>(this._config);

  /** Final labels: defaults < config.localization < `localize` input. */
  readonly labels = computed<NgxCalendarLocalization>(() =>
    Object.assign(
      new NgxCalendarLocalization(),
      this.config().localization,
      this.localize() ?? {},
    ),
  );

  protected dateAdapterRegistry = inject(DateAdapterRegistry);
  adapter: IDateAdapter = this.dateAdapterRegistry.resolve(this.locale());

  readonly min = input<Date | null, Date | null | undefined>(null, { transform: deserialize });
  readonly max = input<Date | null, Date | null | undefined>(null, { transform: deserialize });

  currYear = signal(0);
  currMonth = signal(0);
  currentWeek = signal(0);

  months: string[] = [];
  weeks: string[] = [];
  // Todo: change to signal
  viewDays: DateViewDay[] = [];
  viewMonths: DateViewMonth[] = [];
  viewYears: DateViewYear[] = [];
  viewWeeks: DateViewWeek[] = [];
  readonly displayMonth = signal('');

  /** First year of the page currently shown in the year picker. */
  yearPageStart = 0;

  minDate: Date | null = null;
  maxDate: Date | null = null;

  constructor() {
    effect(() => {
      const minDate = this.min();
      const maxDate = this.max();
      const minChanged = !sameDate(minDate, this.minDate);
      const maxChanged = !sameDate(maxDate, this.maxDate);
      if (!minChanged && !maxChanged) return;

      this.minDate = minDate;
      this.maxDate = maxDate;
      this.onDateBoundsChange();
    });
  }

  protected onDateBoundsChange(): void {}

  renderCalendar(
    view: CalendarView,
    selected?: CalendarDate,
    events?: MsEvents[],
    callback?: Function,
  ) {
    switch (view) {
      case 'month':
        this.renderDay(selected, events);
        break;
      case 'week':
        this.renderWeek();
        break;
      case 'day':
        this.renderWeek();
        break;
    }

    this.displayMonth.set(this.months[this.currMonth()] ?? '');

    if (callback) callback();
  }

  renderDatePicker(
    view: DatePickerView,
    selected?: CalendarDate,
    events?: MsEvents[],
    callback?: Function,
  ) {
    switch (view) {
      case 'day':
        this.renderDay(selected, events);
        break;
      case 'month':
        this.renderMonth(selected);
        break;
      case 'year':
        this.renderYear(selected);
        break;
    }

    this.displayMonth.set(this.months[this.currMonth()] ?? '');

    if (callback) callback();
  }

  /** Aligns the year page so that it contains `year`. */
  alignYearPage(year: number = this.currYear()) {
    this.yearPageStart = Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  }

  renderYear(selected?: CalendarDate) {
    this.viewYears = [];
    const today = this.adapter.today();
    // the page is aligned by the caller when the year view opens; it is kept as is
    // while the user pages back and forth
    if (!this.yearPageStart) this.alignYearPage();
    const s = this.yearPageStart;

    for (let i = s; i < s + YEARS_PER_PAGE; i++) {
      this.viewYears.push({
        year: i,
        selected: selected?.year === i,
        isToday: today.year === i,
        active: this.checkActiveYear(i),
      });
    }
  }

  renderMonth(selected?: CalendarDate) {
    this.viewMonths = [];
    const today = this.adapter.today();

    for (let i = 0; i < this.months.length; i++) {
      this.viewMonths.push({
        month: i,
        displayMonth: this.months[i],
        selected: selected?.year === this.currYear() && selected.month === i,
        isToday: today.year === this.currYear() && today.month === i,
        active: this.checkActiveMonth(this.currYear(), i),
      });
    }
  }

  renderWeek(anchorDate?: Date) {
    this.viewWeeks = [];
    for (let t = 0; t < 24; t += 0.5) {
      this.viewWeeks.push({
        time: t,
        displayTime: convertNumberToTime(t),
        weeks: this.weeks,
        active: true,
        selected: false,
      });
    }
  }

  /** Returns the seven real dates belonging to the locale's week. */
  getWeekDates(anchor: Date): Date[] {
    const start = this.adapter.getStartOfWeek(anchor);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }

  getEventsForDate(date: Date, events?: MsEvents[]): MsEventViewer[] {
    return this.getEvents(date, events);
  }

  protected normalizeEvent(event: MsEvents): { event: MsEvents; start: Date; end: Date } {
    const start =
      event.start instanceof Date ? new Date(event.start) : new Date(event.start as any);
    const rawEnd = event.end
      ? event.end instanceof Date
        ? new Date(event.end)
        : new Date(event.end as any)
      : new Date(start);

    if (Number.isNaN(start.getTime())) return { event, start: new Date(NaN), end: new Date(NaN) };

    // Day-calendar events use an inclusive end date. For timed events, the actual
    // end instant is respected. An omitted end means a one-day event.
    const end = Number.isNaN(rawEnd.getTime()) ? new Date(start) : rawEnd;
    return { event, start, end: end < start ? new Date(start) : end };
  }

  /**
   * Renders a fixed 6-row month grid (42 cells) and attaches events to every
   * visible day. Leading/trailing cells belong to the neighbouring months
   * (`outside`); they stay selectable as long as they are inside min/max.
   *
   * The event list is normalized to MsEventViewer so the template can draw
   * continuation edges similar to FullCalendar's month view.
   */
  renderDay(selected?: CalendarDate, events?: MsEvents[]) {
    this.viewDays = [];

    const year = this.currYear();
    const month = this.currMonth();
    const leading = this.adapter.firstDayofMonth(year, month);
    const monthLength = this.adapter.lastDateofMonth(year, month);
    const prev = shiftYearMonth(year, month, -1);
    const next = shiftYearMonth(year, month, 1);
    const prevLength = this.adapter.lastDateofLastMonth(year, month);

    const todayDate = this.adapter.getDate(this.adapter.today());
    const selectedDate = selected ? (selected.date ?? this.adapter.getDate(selected)) : null;

    const push = (day: number, y: number, m: number, outside: boolean) => {
      const date = this.adapter.getDate({ locale: this.locale(), year: y, month: m, day });
      const column = this.viewDays.length % 7;
      this.viewDays.push({
        day,
        outside,
        label: this.adapter.formatDate(
          { locale: this.locale(), year: y, month: m, day, dayOfWeek: column },
          'EEEE d MMMM yyyy',
        ) ?? '',
        active: this.checkActiveDate(date),
        isToday: sameDate(date, todayDate),
        selected: !!selectedDate && sameDate(date, selectedDate),
        date,
        events: this.getEvents(date, events),
      });
    };

    for (let i = leading; i > 0; i--) push(prevLength - i + 1, prev.year, prev.month, true);
    for (let day = 1; day <= monthLength; day++) push(day, year, month, false);
    for (let day = 1; this.viewDays.length < MONTH_GRID_CELLS; day++) {
      push(day, next.year, next.month, true);
    }
  }

  checkActiveDate(date: Date) {
    const c = clampDate(date, this.minDate, this.maxDate);
    return c === 0;
  }

  /** A month is selectable when at least one of its days is inside min/max. */
  checkActiveMonth(year: number, month: number) {
    const first = this.adapter.getDate({ locale: this.locale(), year, month, day: 1 });
    const last = this.adapter.getDate({
      locale: this.locale(),
      year,
      month,
      day: this.adapter.lastDateofMonth(year, month),
    });
    return this.overlapsBounds(first, last);
  }

  /** A year is selectable when at least one of its days is inside min/max. */
  checkActiveYear(year: number) {
    const first = this.adapter.getDate({ locale: this.locale(), year, month: 0, day: 1 });
    const last = this.adapter.getDate({
      locale: this.locale(),
      year,
      month: 11,
      day: this.adapter.lastDateofMonth(year, 11),
    });
    return this.overlapsBounds(first, last);
  }

  private overlapsBounds(first: Date, last: Date): boolean {
    if (this.maxDate && compareDate(first, this.maxDate) > 0) return false;
    if (this.minDate && compareDate(last, this.minDate) < 0) return false;
    return true;
  }

  protected getEvents(date: Date, events?: MsEvents[]): MsEventViewer[] {
    if (!events?.length) return [];

    return events
      .filter((event) => {
        const start = event.start instanceof Date ? event.start : new Date(event.start as any);
        const end = event.end
          ? event.end instanceof Date
            ? event.end
            : new Date(event.end as any)
          : start;

        return compareDate(date, start) >= 0 && compareDate(date, end) <= 0;
      })
      .map((event) => {
        const start = event.start instanceof Date ? event.start : new Date(event.start as any);
        const end = event.end
          ? event.end instanceof Date
            ? event.end
            : new Date(event.end as any)
          : start;

        return {
          ...event,
          continuesBefore: compareDate(start, date) < 0,
          continuesAfter: compareDate(end, date) > 0,
          isStart: compareDate(start, date) === 0,
          isEnd: compareDate(end, date) === 0,
        };
      });
  }
}
