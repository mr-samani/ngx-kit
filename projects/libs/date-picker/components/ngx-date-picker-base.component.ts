import { clampDate, compareDate, deserialize, sameDate } from '../helpers/date.helper';
import { IDateAdapter } from '../adapters/IAdapter';
import { CalendarDate } from '../adapters/calendar-date';
import { MsEvents, MsEventViewer } from '../models/events';
import { DateAdapterRegistry } from '../adapters/date-adapter-registry';
import {
  afterNextRender,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
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

/** Years loaded around the current year when the year list opens, and per scroll step. */
export const YEAR_WINDOW = 40;
export const YEAR_STEP = 30;
/** Row pitch of the month/year wheels in px (38px row + 2px gap) - keep in sync with the SCSS. */
export const WHEEL_STEP = 40;
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

  /** Year list window: the list is extended on scroll ("infinite"), bounded by min/max. */
  yearFrom = 0;
  yearTo = 0;
  private yearsBusy = false;
  private wheelTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

  protected readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly injectorRef = inject(Injector);

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
      // untracked: re-rendering reads/writes signals, which must not become dependencies
      untracked(() => this.onDateBoundsChange());
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

  /** First / last year the list may show (calendar range, narrowed by min/max). */
  protected yearBounds(): [number, number] {
    let [lo, hi] = this.adapter.yearRange ?? [-100000, 100000];
    if (this.minDate) lo = Math.max(lo, this.adapter.toLocale(this.minDate).year);
    if (this.maxDate) hi = Math.min(hi, this.adapter.toLocale(this.maxDate).year);
    return [lo, Math.max(lo, hi)];
  }

  /** Re-centres the year list on `year`. */
  resetYearWindow(year: number = this.currYear()) {
    const [lo, hi] = this.yearBounds();
    this.yearFrom = Math.max(lo, year - YEAR_WINDOW);
    this.yearTo = Math.min(hi, year + YEAR_WINDOW);
  }

  renderYear(selected?: CalendarDate) {
    this.viewYears = [];
    const today = this.adapter.today();
    if (!this.yearTo) this.resetYearWindow();
    const bounded = !!(this.minDate || this.maxDate);

    for (let i = this.yearFrom; i <= this.yearTo; i++) {
      this.viewYears.push({
        year: i,
        selected: selected?.year === i,
        isToday: today.year === i,
        // without min/max every year is valid: skip the (costly for Hijri/Chinese) check
        active: bounded ? this.checkActiveYear(i) : true,
      });
    }
  }

  /**
   * Scroll handler of the year list: loads more years when the user gets close to an edge, so
   * the list feels endless without rendering hundreds of years up front.
   */
  onYearListScroll(ev: Event, selected?: CalendarDate) {
    const el = ev.target as HTMLElement;
    if (this.yearsBusy) return;
    const [lo, hi] = this.yearBounds();
    const edge = 90;

    if (el.scrollTop < edge && this.yearFrom > lo) {
      this.yearsBusy = true;
      const before = el.scrollHeight;
      const top = el.scrollTop;
      this.yearFrom = Math.max(lo, this.yearFrom - YEAR_STEP);
      this.renderYear(selected);
      afterNextRender(
        () => {
          // keep what the user is looking at in place after prepending
          el.scrollTop = top + (el.scrollHeight - before);
          this.yearsBusy = false;
        },
        { injector: this.injectorRef },
      );
    } else if (el.scrollHeight - el.scrollTop - el.clientHeight < edge && this.yearTo < hi) {
      this.yearsBusy = true;
      this.yearTo = Math.min(hi, this.yearTo + YEAR_STEP);
      this.renderYear(selected);
      afterNextRender(() => (this.yearsBusy = false), { injector: this.injectorRef });
    }
  }

  /** The selected date the lists should mark (overridden by the single date picker). */
  protected listsSelected(): CalendarDate | undefined {
    return undefined;
  }

  /** Puts the current month and year in the middle of their wheels. */
  scrollListsToCurrent() {
    afterNextRender(
      () => {
        const root = this.hostEl.nativeElement;
        root.querySelectorAll<HTMLElement>('.list').forEach((list) => {
          const index = Array.from(list.children).findIndex((c) => c.classList.contains('current'));
          if (index >= 0) list.scrollTop = index * WHEEL_STEP;
        });
      },
      { injector: this.injectorRef },
    );
  }

  /**
   * Scroll handler of a month/year wheel. When the wheel stops (debounced) the row in the middle
   * becomes the selection - like the date wheels of iOS. The year wheel also loads more years.
   */
  onWheelScroll(ev: Event, kind: 'month' | 'year') {
    const list = ev.target as HTMLElement;
    if (kind === 'year') this.onYearListScroll(ev, this.listsSelected());

    clearTimeout(this.wheelTimers.get(list));
    this.wheelTimers.set(
      list,
      setTimeout(() => {
        this.wheelTimers.delete(list);
        if (!list.isConnected) return;
        const i = Math.round(list.scrollTop / WHEEL_STEP);
        if (kind === 'year') {
          const item = this.viewYears[i];
          if (item?.active && item.year !== this.currYear()) {
            this.currYear.set(item.year);
            this.renderMonth(this.listsSelected());
            this.displayMonth.set(this.months[this.currMonth()] ?? '');
          }
        } else {
          const item = this.viewMonths[i];
          if (item?.active && item.month !== this.currMonth()) {
            this.currMonth.set(item.month);
            this.renderMonth(this.listsSelected());
            this.displayMonth.set(this.months[this.currMonth()] ?? '');
          }
        }
      }, 110),
    );
  }

  /** Smoothly centres the tapped row; the wheel then selects it when it settles. */
  protected centerRow(ev: Event, index: number) {
    const list = (ev.currentTarget as HTMLElement).parentElement;
    list?.scrollTo({ top: index * WHEEL_STEP, behavior: 'smooth' });
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
