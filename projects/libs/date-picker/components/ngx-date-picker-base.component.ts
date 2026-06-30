import { clampDate, clampMonth, clampYear, compareDate } from '../helpers/date.helper';
import { IDateAdapter } from '../adapters/IAdapter';
import { CalendarDate } from '../adapters/calendar-date';
import { MsEvents } from '../models/events';
import { DateAdapterRegistry } from '../adapters/date-adapter-registry';
import { inject } from '@angular/core';
import { CalendarView, DatePickerView } from '../models/view';
import { DateViewDay, DateViewMonth, DateViewWeek, DateViewYear } from '../models/date';
import { convertNumberToTime } from '../helpers/time.helper';

export abstract class NgxDatePickerBase {
  protected _locale: string = 'en';
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
    view: CalendarView | DatePickerView,
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
      case 'week':
        this.renderWeek();
        break;
    }
    this.displayMonth = this.months[this.currMonth];
    if (callback) {
      callback();
    }
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

  /** only in calendar view */
  renderWeek() {
    this.viewWeeks = [];
    for (let t = 0; t <= 24; t = t + 0.5) {
      this.viewWeeks.push({
        time: t,
        displayTime: convertNumberToTime(t),
        weeks: this.weeks,
        active: true,
        selected: false,
      });
    }
  }

  renderDay(selected?: CalendarDate, _events?: MsEvents[]) {
    this.viewDays = [];
    let firstDayofMonth = this.adapter.firstDayofMonth(this.currYear, this.currMonth);
    let lastDateofMonth = this.adapter.lastDateofMonth(this.currYear, this.currMonth);
    let lastDayofMonth = this.adapter.lastDayofMonth(this.currYear, this.currMonth);
    let lastDateofLastMonth = this.adapter.lastDateofLastMonth(this.currYear, this.currMonth);
    for (let i = firstDayofMonth; i > 0; i--) {
      const d = lastDateofLastMonth - i + 1;
      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth - 1,
        day: d,
      });
      this.viewDays.push({
        day: d,
        active: false,
        isToday: false,
        selected: false,
        date,
      });
    }
    // console.log('selected', this.selected);
    for (let i = 1; i <= lastDateofMonth; i++) {
      let today = this.adapter.today();
      let isToday =
        i === today.day && this.currMonth === today.month && this.currYear === today.year;
      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth,
        day: i,
      });
      const events = this.getEvents(date, _events);
      this.viewDays.push({
        day: i,
        active: this.checkActiveDate(date),
        isToday: isToday,
        selected:
          i === selected?.day &&
          selected.month === this.currMonth &&
          selected.year === this.currYear,
        date,
        events,
      });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      const d = i - lastDayofMonth + 1;
      const date = this.adapter.getDate({
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth + 1,
        day: d,
      });
      this.viewDays.push({
        day: d,
        active: false,
        isToday: false,
        selected: false,
        date,
      });
    }
  }

  checkActiveDate(date: Date) {
    let c = clampDate(date, this.minDate, this.maxDate);
    if (c < 0) {
      return false;
    } else if (c > 0) {
      return false;
    }
    return true;
  }
  checkActiveMonth(year: number, month: number) {
    let fd = this.adapter.getDate({ locale: this._locale, year, month, day: 1 });
    let ld = this.adapter.getDate({
      locale: this._locale,
      year,
      month,
      day: this.adapter.lastDateofMonth(year, month),
    });
    let min = this.adapter.getStartOf(this.minDate, 'month');
    let max = this.adapter.getLastOf(this.maxDate, 'month');

    return clampMonth(fd, min, max) === 0 && clampMonth(ld, min, max) === 0;
  }

  // g(d: Date | null) {
  //   if (d)
  //     return d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate();
  //   else return '';
  // }

  checkActiveYear(year: number) {
    const d = this.adapter.getDate({ locale: this._locale, year, month: 1, day: 1 });
    let c = clampYear(d, this.minDate, this.maxDate);
    if (c < 0) {
      return false;
    } else if (c > 0) {
      return false;
    }
    return true;
  }

  private getEvents(date: Date, events?: MsEvents[]): MsEvents[] {
    if (!events || events.length == 0) return [];

    let eventList = [];

    eventList = events.filter((x) => {
      let s = compareDate(date, x.start);
      let e = x.end ? compareDate(date, x.end) : s;
      //  console.info('compare', date, '<=>', x.start, 's', s, e);
      if (s >= 0 && e <= 0) return true;
      else return false;
    });

    // console.log('event', date, eventList);
    return eventList;
  }
}
