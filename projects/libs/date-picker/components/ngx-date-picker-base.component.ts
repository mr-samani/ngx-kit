import { clampDate, clampMonth, clampYear, compareDate } from '../helpers/date.helper';
import { IDateAdapter } from '../adapters/IAdapter';
import { CalendarDate } from '../adapters/calendar-date';
import { MsEvents, MsEventViewer } from '../models/events';
import { DateAdapterRegistry } from '../adapters/date-adapter-registry';
import { inject } from '@angular/core';
import { CalendarView, DatePickerView } from '../models/view';
import { DateViewDay, DateViewMonth, DateViewWeek, DateViewYear } from '../models/date';
import { convertNumberToTime } from '../helpers/time.helper';

export abstract class NgxDatePickerBase {
  protected _locale = 'en';
  protected dateAdapterRegistry = inject(DateAdapterRegistry);
  adapter: IDateAdapter = this.dateAdapterRegistry.resolve(this._locale);

  currYear!: number;
  currMonth!: number;
  currentWeek!: number;

  months: string[] = [];
  weeks: string[] = [];
  viewDays: DateViewDay[] = [];
  viewMonths: DateViewMonth[] = [];
  viewYears: DateViewYear[] = [];
  viewWeeks: DateViewWeek[] = [];
  displayMonth = '';

  minDate: Date | null = null;
  maxDate: Date | null = null;

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

    this.displayMonth = this.months[this.currMonth] ?? '';

    if (callback) callback();
  }
  renderِDatePicker(
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
        this.renderMonth();
        break;
      case 'year':
        this.renderYear();
        break;
    }

    this.displayMonth = this.months[this.currMonth] ?? '';

    if (callback) callback();
  }

  renderYear() {
    this.viewYears = [];
    const s = this.currYear - 10;
    const e = this.currYear + 10;

    for (let i = s; i < e; i++) {
      this.viewYears.push({
        year: i,
        selected: i === this.currYear,
        active: this.checkActiveYear(i),
      });
    }
  }

  renderMonth() {
    this.viewMonths = [];

    for (let i = 0; i < this.months.length; i++) {
      this.viewMonths.push({
        month: i,
        displayMonth: this.months[i],
        selected: i === this.currMonth,
        active: this.checkActiveMonth(this.currYear, i),
      });
    }
  }

  renderWeek() {
    this.viewWeeks = [];

    for (let t = 0; t <= 24; t += 0.5) {
      this.viewWeeks.push({
        time: t,
        displayTime: convertNumberToTime(t),
        weeks: this.weeks,
        active: true,
        selected: false,
      });
    }
  }

  /**
   * Renders a 6-row month grid and attaches events to every visible day.
   *
   * The event list is normalized to MsEventViewer so the template can draw
   * continuation edges similar to FullCalendar's month view.
   */
  renderDay(selected?: CalendarDate, events?: MsEvents[]) {
    this.viewDays = [];

    const firstDayOfMonth = this.adapter.firstDayofMonth(this.currYear, this.currMonth);
    const lastDateOfMonth = this.adapter.lastDateofMonth(this.currYear, this.currMonth);
    const lastDayOfMonth = this.adapter.lastDayofMonth(this.currYear, this.currMonth);
    const lastDateOfLastMonth = this.adapter.lastDateofLastMonth(this.currYear, this.currMonth);

    for (let i = firstDayOfMonth; i > 0; i--) {
      const day = lastDateOfLastMonth - i + 1;
      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth - 1,
        day,
      });

      this.viewDays.push({
        day,
        active: false,
        isToday: false,
        selected: false,
        date,
        events: this.getEvents(date, events),
      });
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
      const today = this.adapter.today();
      const isToday =
        day === today.day && this.currMonth === today.month && this.currYear === today.year;

      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth,
        day,
      });

      this.viewDays.push({
        day,
        active: this.checkActiveDate(date),
        isToday,
        selected:
          day === selected?.day &&
          selected.month === this.currMonth &&
          selected.year === this.currYear,
        date,
        events: this.getEvents(date, events),
      });
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      const day = i - lastDayOfMonth + 1;
      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth + 1,
        day,
      });

      this.viewDays.push({
        day,
        active: false,
        isToday: false,
        selected: false,
        date,
        events: this.getEvents(date, events),
      });
    }
  }

  checkActiveDate(date: Date) {
    const c = clampDate(date, this.minDate, this.maxDate);
    return c === 0;
  }

  checkActiveMonth(year: number, month: number) {
    const fd = this.adapter.getDate({ locale: this._locale, year, month, day: 1 });
    const ld = this.adapter.getDate({
      locale: this._locale,
      year,
      month,
      day: this.adapter.lastDateofMonth(year, month),
    });

    const min = this.adapter.getStartOf(this.minDate, 'month');
    const max = this.adapter.getLastOf(this.maxDate, 'month');

    return clampMonth(fd, min, max) === 0 && clampMonth(ld, min, max) === 0;
  }

  checkActiveYear(year: number) {
    const d = this.adapter.getDate({ locale: this._locale, year, month: 1, day: 1 });
    return clampYear(d, this.minDate, this.maxDate) === 0;
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
