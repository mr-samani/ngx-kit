import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { MsEvents, MsEventViewer } from '../../models/events';
import { CalendarDayColumn, CalendarTimedEvent, DateViewDay } from '../../models/date';
import { CalendarView } from '../../models/view';
import { ISelectedEvent } from '../../models/selected-event';
import { deserialize, sameDate, compareDate } from '../../helpers/date.helper';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { NGX_CALENDAR_LOCALIZATION, NgxCalendarLocalization } from '../../tokens/localization';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_HEIGHT = 64;

@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar.component.html',
  styleUrls: ['./ngx-calendar.component.scss'],
  imports: [CommonModule],
  providers: [DateAdapterRegistry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxCalendarComponent extends NgxDatePickerBase implements OnInit {
  defaultLocalization = inject(NGX_CALENDAR_LOCALIZATION);
  localize = input<NgxCalendarLocalization>(this.defaultLocalization);

  _config = new NgxDatePickerConfig();
  @Input() set config(val: NgxDatePickerConfig) {
    this._config = { ...new NgxDatePickerConfig(), ...val };
  }

  @Input() set locale(val: string) {
    this._locale = val;
    this.adapter = this.dateAdapterRegistry.resolve(this._locale);
    if (this.currYear !== undefined) this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  @Input('min') set setMin(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.minDate)) {
      this.minDate = validValue;
      this.renderCalendar(this.view);
    }
  }

  @Input('max') set setMax(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.maxDate)) {
      this.maxDate = validValue;
      this.renderCalendar(this.view);
    }
  }

  @Input() view: CalendarView = 'month';

  private _events: MsEvents[] = [];
  @Input() set events(val: MsEvents[]) {
    this._events = Array.isArray(val) ? val : [];
    if (this.anchorDate) this.renderCalendar(this.view);
  }
  get events(): MsEvents[] {
    return this._events;
  }

  @Output() dateChange = new EventEmitter<DateViewDay>();
  @Output() selectEvent = new EventEmitter<ISelectedEvent>();

  selected?: Date;
  anchorDate!: Date;

  // Month/event view
  eventViewItems: { event: MsEventViewer; start: Date; end: Date }[] = [];

  // Week/day timed view
  weekDays: CalendarDayColumn[] = [];
  allDayByColumn: CalendarTimedEvent[][] = [];
  timeSlots = Array.from({ length: 48 }, (_, i) => i * 30);
  readonly hourHeight = HOUR_HEIGHT;
  readonly timeColumnWidth = 64;

  calendarWrapper = viewChild<ElementRef<HTMLElement>>('calendarWrapper');

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
    this.anchorDate = this.selected
      ? new Date(this.selected)
      : this.adapter.getDate(this.adapter.today());
    this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  @HostListener('window:resize')
  onResize() {
    this.calcCellSize();
  }

  calcCellSize() {
    const fullWidth = this.calendarWrapper()?.nativeElement?.clientWidth ?? 0;
    this.minHeight = fullWidth > this.defaultHeight ? this.defaultHeight : Math.max(fullWidth, 320);
    this.weeks = fullWidth <= 500 ? this.adapter.shortDays : this.adapter.longDays;
  }

  override renderCalendar(view: CalendarView) {
    if (!this.anchorDate) return;

    this.syncAnchorToLocale();

    switch (view) {
      case 'month':
        super.renderCalendar('month', undefined, this._events);
        break;
      case 'week':
      case 'day':
        this.renderTimedView();
        break;
      case 'event':
        this.renderEventView();
        break;
    }

    this.displayMonth = this.months[this.currMonth] ?? '';
    queueMicrotask(() => this.calcCellSize());
  }

  private syncAnchorToLocale() {
    const localeDate = this.adapter.toLocale(this.anchorDate);
    this.currYear = localeDate.year;
    this.currMonth = localeDate.month ?? 0;
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
  }

  private renderTimedView() {
    const dates = this.getWeekDates(this.anchorDate);
    const visibleDates = this.view === 'day' ? [new Date(this.anchorDate)] : dates;

    this.weekDays = visibleDates.map((date, column) => ({
      date,
      label: this.adapter.formatDate(this.adapter.toLocale(date), 'full') ?? '',
      dayNumber: String(this.adapter.toLocale(date).day),
      isToday: sameDate(date, this.adapter.getDate(this.adapter.today())),
      events: this.buildTimedEventsForDay(date, column, visibleDates.length),
    }));

    this.allDayByColumn = this.weekDays.map((day, column) =>
      this.buildAllDayEventsForDay(day.date, column),
    );

    this.viewWeeks = this.timeSlots.map((minutes) => ({
      time: minutes / 60,
      displayTime: this.formatTime(minutes),
      weeks: visibleDates.map(() => ''),
      active: true,
      selected: false,
    }));
  }

  private buildTimedEventsForDay(
    date: Date,
    column: number,
    columnCount: number,
  ): CalendarTimedEvent[] {
    const dayStart = this.startOfDay(date);
    const dayEnd = this.endOfDay(date);

    const candidates = this._events
      .map((event) => {
        const n = this.normalizeEvent(event);
        return { ...n, source: event };
      })
      .filter(
        ({ start, end }) =>
          !Number.isNaN(start.getTime()) &&
          compareDate(end, dayStart) >= 0 &&
          compareDate(start, dayEnd) <= 0,
      )
      .map(({ event, start, end }) => {
        const segmentStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
        const segmentEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));
        const startsBefore = compareDate(start, dayStart) < 0;
        const startsAfter = compareDate(start, dayStart) > 0;
        const endsAfter = compareDate(end, dayEnd) > 0;
        const allDay = !!event.allDay;

        return {
          ...event,
          start,
          end,
          segmentStart,
          segmentEnd,
          allDay,
          continuesBefore: startsBefore,
          continuesAfter: endsAfter,
          isStart: !startsBefore,
          isEnd: !endsAfter,
          column,
          columnCount,
        };
      });

    // All-day events are rendered in the all-day lane, not over the hour grid.
    const timed = candidates.filter((e) => !e.allDay);

    // A compact overlap layout: events that intersect share columns rather than
    // painting over each other. This is the same core idea used by calendar UIs.
    const lanes: CalendarTimedEvent[][] = [];
    const result: CalendarTimedEvent[] = [];

    for (const e of timed.sort((a, b) => a.segmentStart.getTime() - b.segmentStart.getTime())) {
      let lane = lanes.findIndex((items) => {
        const last = items[items.length - 1];
        return last.end.getTime() <= e.segmentStart.getTime();
      });
      if (lane < 0) {
        lane = lanes.length;
        lanes.push([]);
      }
      lanes[lane].push(e as any);

      const startMinutes = e.segmentStart.getHours() * 60 + e.segmentStart.getMinutes();
      const endMinutes = e.segmentEnd.getHours() * 60 + e.segmentEnd.getMinutes();
      const effectiveEnd = Math.max(endMinutes, startMinutes + 30);

      result.push({
        ...(e as any),
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: Math.max(((effectiveEnd - startMinutes) / 60) * HOUR_HEIGHT, 28),
        column: lane,
        columnCount: 1,
      });
    }

    const laneCount = Math.max(lanes.length, 1);
    return result.map((e) => ({
      ...e,
      column: e.column,
      columnCount: laneCount,
    }));
  }

  private buildAllDayEventsForDay(date: Date, column: number): CalendarTimedEvent[] {
    const dayStart = this.startOfDay(date);
    const dayEnd = this.endOfDay(date);
    const result: CalendarTimedEvent[] = [];

    for (const event of this._events) {
      const n = this.normalizeEvent(event);
      if (!event.allDay || Number.isNaN(n.start.getTime())) continue;
      if (compareDate(n.end, dayStart) < 0 || compareDate(n.start, dayEnd) > 0) continue;

      result.push({
        ...event,
        start: n.start,
        end: n.end,
        top: 0,
        height: 24,
        allDay: true,
        column,
        columnCount: 1,
        continuesBefore: compareDate(n.start, dayStart) < 0,
        continuesAfter: compareDate(n.end, dayEnd) > 0,
        isStart: compareDate(n.start, dayStart) === 0,
        isEnd: compareDate(n.end, dayEnd) === 0,
      });
    }
    return result;
  }

  private renderEventView() {
    const monthStart = this.adapter.getDate({
      locale: this._locale,
      year: this.currYear,
      month: this.currMonth,
      day: 1,
    });
    const monthEnd = this.adapter.getDate({
      locale: this._locale,
      year: this.currYear,
      month: this.currMonth,
      day: this.adapter.lastDateofMonth(this.currYear, this.currMonth),
    });

    this.eventViewItems = this._events
      .map((event) => {
        const n = this.normalizeEvent(event);
        return { event: event as MsEventViewer, start: n.start, end: n.end };
      })
      .filter(
        ({ start, end }) => compareDate(end, monthStart) >= 0 && compareDate(start, monthEnd) <= 0,
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  get headerText(): string {
    if (!this.anchorDate) return '';

    if (this.view === 'day') {
      return this.adapter.formatDate(this.adapter.toLocale(this.anchorDate), 'full') ?? '';
    }

    if (this.view === 'week') {
      const days = this.getWeekDates(this.anchorDate);
      return this.formatDateRange(days[0], days[6]);
    }

    return `${this.displayMonth} ${this.currYear}`;
  }

  formatDateRange(start: Date, end: Date): string {
    const s = this.adapter.toLocale(start);
    const e = this.adapter.toLocale(end);

    // Keep a compact but unambiguous range. If the year is the same, show it once.
    const startText = this.adapter.formatDate(s, 'd MMMM') ?? '';
    const endText = this.adapter.formatDate(e, 'd MMMM') ?? '';
    return s.year === e.year
      ? `${startText} – ${endText}, ${s.year}`
      : `${startText}, ${s.year} – ${endText}, ${e.year}`;
  }

  formatEventDate(date: Date): string {
    return this.adapter.formatDate(this.adapter.toLocale(date), 'd MMMM, yyyy') ?? '';
  }

  formatTime(minutes: number): string {
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }

  changeView(v: CalendarView) {
    this.view = v;
    this.renderCalendar(v);
  }

  gotoToday() {
    this.anchorDate = this.adapter.getDate(this.adapter.today());
    this.selected = new Date(this.anchorDate);
    this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  selectDay(ev: Event, item: DateViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.selected = item.date;
      this.anchorDate = new Date(item.date!);
      this.dateChange.emit(item);
    }
  }

  next() {
    this.navigate(1);
  }

  previous() {
    this.navigate(-1);
  }

  private navigate(direction: 1 | -1) {
    const d = new Date(this.anchorDate);

    if (this.view === 'month' || this.view === 'event') {
      const locale = this.adapter.toLocale(d);
      this.anchorDate = this.adapter.getDate({
        locale: this._locale,
        year: locale.year,
        month: locale.month! + direction,
        day: 1,
      });
    } else if (this.view === 'week') {
      d.setDate(d.getDate() + direction * 7);
      this.anchorDate = d;
    } else {
      d.setDate(d.getDate() + direction);
      this.anchorDate = d;
    }

    this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  onclickEvent(ev: Event, item: DateViewDay, event: MsEvents) {
    ev.stopPropagation();
    this.selectEvent.emit({ date: item.date!, event });
  }

  onTimedEventClick(ev: Event, event: MsEvents, date: Date) {
    ev.stopPropagation();
    this.selectEvent.emit({ date, event });
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private readonly defaultHeight = 600;
  minHeight = this.defaultHeight;
}
