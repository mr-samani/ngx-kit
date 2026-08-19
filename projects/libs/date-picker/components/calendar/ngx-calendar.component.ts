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
import {
  CalendarDayColumn,
  CalendarMonthEventSegment,
  CalendarTimedEvent,
  DateViewDay,
} from '../../models/date';
import { CalendarView } from '../../models/view';
import { ISelectedEvent } from '../../models/selected-event';
import {
  CalendarEventChange,
  CalendarEventInteractionType,
} from '../../models/calendar-event-interaction';
import { deserialize, sameDate, compareDate } from '../../helpers/date.helper';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { NGX_CALENDAR_LOCALIZATION, NgxCalendarLocalization } from '../../tokens/localization';

const HOUR_HEIGHT = 64;
const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2;
const MIN_EVENT_MINUTES = 30;
const MONTH_ROW_COUNT = 6;
const MONTH_COLUMN_COUNT = 7;

interface NormalizedCalendarEvent {
  source: MsEvents;
  start: Date;
  end: Date;
}

interface EventInteractionState {
  type: CalendarEventInteractionType;
  source: MsEvents;
  previousEvent: MsEvents;
  pointerId: number;
  startX: number;
  startY: number;
  originColumn: number;
  originRow: number;
  preview: MsEvents;
  deltaDays: number;
  deltaMinutes: number;
  active: boolean;
  surface: 'month' | 'timed' | 'all-day';
}

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
  @Output() eventChange = new EventEmitter<CalendarEventChange>();
  @Output() eventsChange = new EventEmitter<MsEvents[]>();

  selected?: Date;
  anchorDate!: Date;

  eventViewItems: { event: MsEventViewer; start: Date; end: Date }[] = [];
  monthEventSegments: CalendarMonthEventSegment[] = [];
  monthEventRows: CalendarMonthEventSegment[][] = Array.from({ length: MONTH_ROW_COUNT }, () => []);

  weekDays: CalendarDayColumn[] = [];
  allDayByColumn: CalendarTimedEvent[][] = [];
  timeSlots = Array.from({ length: 48 }, (_, i) => i * 30);
  readonly hourHeight = HOUR_HEIGHT;
  readonly timeColumnWidth = 64;

  calendarWrapper = viewChild<ElementRef<HTMLElement>>('calendarWrapper');

  protected interaction: EventInteractionState | null = null;

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

  @HostListener('document:pointermove', ['$event'])
  onDocumentPointerMove(event: PointerEvent) {
    if (!this.interaction || event.pointerId !== this.interaction.pointerId) return;
    this.updateEventInteraction(event);
  }

  @HostListener('document:pointerup', ['$event'])
  onDocumentPointerUp(event: PointerEvent) {
    if (!this.interaction || event.pointerId !== this.interaction.pointerId) return;
    this.finishEventInteraction(event, false);
  }

  @HostListener('document:pointercancel', ['$event'])
  onDocumentPointerCancel(event: PointerEvent) {
    if (!this.interaction || event.pointerId !== this.interaction.pointerId) return;
    this.finishEventInteraction(event, true);
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
        super.renderCalendar('month', undefined, this.renderEvents);
        this.buildMonthEventSegments();
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

  private get renderEvents(): MsEvents[] {
    return this._events;
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
    const visibleDates = this.view === 'day' ? [new Date(this.startOfDay(this.anchorDate))] : dates;

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

  /**
   * Builds a collision layout per overlap cluster. Each cluster gets its own
   * column count, which prevents a short 09:00 event from being unnecessarily
   * squeezed because another event overlaps at 15:00.
   */
  private buildTimedEventsForDay(
    date: Date,
    column: number,
    columnCount: number,
  ): CalendarTimedEvent[] {
    const dayStart = this.startOfDay(date);
    const dayEnd = this.endOfDay(date);

    const candidates = this.normalizedEvents()
      .filter(
        ({ start, end, source }) =>
          !source.allDay &&
          !Number.isNaN(start.getTime()) &&
          end.getTime() >= dayStart.getTime() &&
          start.getTime() <= dayEnd.getTime(),
      )
      .map(({ source, start, end }) => {
        const segmentStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
        const segmentEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));
        return {
          ...source,
          start,
          end,
          segmentStart,
          segmentEnd,
          allDay: false,
          continuesBefore: start.getTime() < dayStart.getTime(),
          continuesAfter: end.getTime() > dayEnd.getTime(),
          isStart: start.getTime() >= dayStart.getTime() && start.getTime() <= dayEnd.getTime(),
          isEnd: end.getTime() >= dayStart.getTime() && end.getTime() <= dayEnd.getTime(),
          column,
          columnCount,
        } as CalendarTimedEvent & { segmentStart: Date; segmentEnd: Date };
      })
      .sort(
        (a, b) =>
          a.segmentStart.getTime() - b.segmentStart.getTime() ||
          b.segmentEnd.getTime() - a.segmentEnd.getTime(),
      );

    type Positioned = CalendarTimedEvent & { segmentStart: Date; segmentEnd: Date; lane: number };
    const result: Positioned[] = [];
    let cluster: Positioned[] = [];
    let clusterLanes: Positioned[][] = [];
    let clusterEnd = -Infinity;

    const flushCluster = () => {
      if (!cluster.length) return;
      const laneCount = clusterLanes.length;
      for (const item of cluster) {
        item.columnCount = laneCount;
      }
      result.push(...cluster);
      cluster = [];
      clusterLanes = [];
      clusterEnd = -Infinity;
    };

    for (const e of candidates) {
      const start = e.segmentStart.getTime();
      if (cluster.length && start > clusterEnd) flushCluster();

      let lane = clusterLanes.findIndex((items) => {
        const last = items[items.length - 1];
        return last.segmentEnd.getTime() <= start;
      });
      if (lane < 0) {
        lane = clusterLanes.length;
        clusterLanes.push([]);
      }

      const positioned = { ...e, lane, column: lane } as Positioned;
      clusterLanes[lane].push(positioned);
      cluster.push(positioned);
      clusterEnd = Math.max(clusterEnd, e.segmentEnd.getTime());

      const startMinutes = e.segmentStart.getHours() * 60 + e.segmentStart.getMinutes();
      const endMinutes = e.segmentEnd.getHours() * 60 + e.segmentEnd.getMinutes();
      const effectiveEnd = Math.max(endMinutes, startMinutes + MIN_EVENT_MINUTES);
      positioned.top = (startMinutes / 60) * HOUR_HEIGHT;
      positioned.height = Math.max(((effectiveEnd - startMinutes) / 60) * HOUR_HEIGHT, 28);
    }
    flushCluster();

    return result
      .concat(cluster)
      .map(({ lane, segmentStart, segmentEnd, ...event }) => event as CalendarTimedEvent);
  }

  private buildAllDayEventsForDay(date: Date, column: number): CalendarTimedEvent[] {
    const dayStart = this.startOfDay(date);
    const dayEnd = this.endOfDay(date);

    return this.normalizedEvents()
      .filter(
        ({ source, start, end }) =>
          !!source.allDay &&
          !Number.isNaN(start.getTime()) &&
          end.getTime() >= dayStart.getTime() &&
          start.getTime() <= dayEnd.getTime(),
      )
      .map(({ source, start, end }) => ({
        ...source,
        start,
        end,
        top: 0,
        height: 24,
        allDay: true,
        column,
        columnCount: 1,
        continuesBefore: start.getTime() < dayStart.getTime(),
        continuesAfter: end.getTime() > dayEnd.getTime(),
        isStart: start.getTime() >= dayStart.getTime() && start.getTime() <= dayEnd.getTime(),
        isEnd: end.getTime() >= dayStart.getTime() && end.getTime() <= dayEnd.getTime(),
      }));
  }

  /** Creates FullCalendar-style horizontal segments for the six visible month rows. */
  private buildMonthEventSegments() {
    const visibleDays = this.viewDays;
    if (!visibleDays.length) {
      this.monthEventSegments = [];
      this.monthEventRows = Array.from({ length: MONTH_ROW_COUNT }, () => []);
      return;
    }

    const gridStart = this.startOfDay(visibleDays[0].date!);
    const gridEnd = this.endOfDay(visibleDays[visibleDays.length - 1].date!);
    const segments: CalendarMonthEventSegment[] = [];

    for (const { source, start, end } of this.normalizedEvents()) {
      if (
        Number.isNaN(start.getTime()) ||
        end.getTime() < gridStart.getTime() ||
        start.getTime() > gridEnd.getTime()
      )
        continue;

      const clippedStart = new Date(Math.max(start.getTime(), gridStart.getTime()));
      const clippedEnd = new Date(Math.min(end.getTime(), gridEnd.getTime()));
      const firstIndex = this.dayIndexInMonthGrid(clippedStart, gridStart);
      const lastIndex = this.dayIndexInMonthGrid(clippedEnd, gridStart);

      for (
        let index = Math.max(0, firstIndex);
        index <= Math.min(visibleDays.length - 1, lastIndex);
      ) {
        const row = Math.floor(index / MONTH_COLUMN_COUNT);
        const rowEndIndex = Math.min((row + 1) * MONTH_COLUMN_COUNT - 1, lastIndex);
        const startColumn = index % MONTH_COLUMN_COUNT;
        const endColumn = rowEndIndex % MONTH_COLUMN_COUNT;
        const segmentStart = new Date(visibleDays[index].date!);
        const segmentEnd = this.endOfDay(visibleDays[rowEndIndex].date!);

        segments.push({
          ...source,
          start,
          end,
          row,
          startColumn,
          endColumn,
          continuesBefore: start.getTime() < segmentStart.getTime(),
          continuesAfter: end.getTime() > segmentEnd.getTime(),
          isStart:
            start.getTime() >= segmentStart.getTime() && start.getTime() <= segmentEnd.getTime(),
          isEnd: end.getTime() >= segmentStart.getTime() && end.getTime() <= segmentEnd.getTime(),
          lane: 0,
        });

        index = rowEndIndex + 1;
      }
    }

    // Stable ordering makes the same events keep the same visual lane while navigating.
    segments.sort(
      (a, b) =>
        a.row - b.row ||
        a.startColumn - b.startColumn ||
        a.start.getTime() - b.start.getTime() ||
        String(a.title ?? '').localeCompare(String(b.title ?? '')),
    );

    // Assign lanes independently inside every week row.
    const lanesByRow = new Map<number, CalendarMonthEventSegment[][]>();
    for (const segment of segments) {
      const lanes = lanesByRow.get(segment.row) ?? [];
      let lane = lanes.findIndex((items) =>
        items.every((item) => item.endColumn < segment.startColumn),
      );
      if (lane < 0) {
        lane = lanes.length;
        lanes.push([]);
      }
      (segment as CalendarMonthEventSegment & { lane: number }).lane = lane;
      lanes[lane].push(segment);
      lanesByRow.set(segment.row, lanes);
    }

    this.monthEventSegments = segments;
    this.monthEventRows = Array.from({ length: MONTH_ROW_COUNT }, () => []);
    for (const segment of segments) this.monthEventRows[segment.row].push(segment);
  }

  private dayIndexInMonthGrid(date: Date, gridStart: Date): number {
    const a = this.startOfDay(date);
    const b = this.startOfDay(gridStart);
    const aUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const bUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((aUtc - bUtc) / 86_400_000);
  }

  private normalizedEvents(): NormalizedCalendarEvent[] {
    return this.renderEventSources().map((source) => {
      const normalized = this.normalizeEvent(source);
      return { source, start: normalized.start, end: normalized.end };
    });
  }

  private renderEventSources(): MsEvents[] {
    if (!this.interaction?.active) return this._events;
    return this._events.map((event) =>
      this.sameEvent(event, this.interaction!.source) ? this.interaction!.preview : event,
    );
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

    this.eventViewItems = this.renderEventSources()
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
    this.cancelEventInteraction();
    this.view = v;
    this.renderCalendar(v);
  }

  gotoToday() {
    this.cancelEventInteraction();
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
      this.renderCalendar(this.view);
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
    } else {
      d.setDate(d.getDate() + direction * (this.view === 'week' ? 7 : 1));
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
    if (this.interaction?.active) return;
    this.selectEvent.emit({ date, event });
  }

  startMonthEventInteraction(
    ev: PointerEvent,
    segment: CalendarMonthEventSegment,
    type: CalendarEventInteractionType = 'move',
  ) {
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.beginInteraction(ev, segment, type, 'month');
  }

  startTimedEventInteraction(
    ev: PointerEvent,
    event: CalendarTimedEvent,
    type: CalendarEventInteractionType = 'move',
  ) {
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.beginInteraction(ev, event, type, event.allDay ? 'all-day' : 'timed');
  }

  private beginInteraction(
    ev: PointerEvent,
    event: MsEvents,
    type: CalendarEventInteractionType,
    _surface: 'month' | 'timed' | 'all-day',
  ) {
    const source = this._events.find((candidate) => this.sameEvent(candidate, event));
    if (!source) return;
    this.interaction = {
      type,
      source,
      previousEvent: { ...source },
      pointerId: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      originColumn: 0,
      originRow: 0,
      preview: { ...source },
      deltaDays: 0,
      deltaMinutes: 0,
      active: true,
      surface: _surface,
    };
  }

  private updateEventInteraction(ev: PointerEvent) {
    const state = this.interaction;
    if (!state) return;

    const monthMetrics = state.surface === 'month' ? this.monthPointerDelta(ev) : null;
    const timedMetrics = state.surface === 'timed' ? this.timedPointerDelta(ev) : null;
    const allDayMetrics = state.surface === 'all-day' ? this.allDayPointerDelta(ev) : null;
    let deltaDays = monthMetrics?.days ?? timedMetrics?.days ?? allDayMetrics?.days ?? 0;
    let deltaMinutes = timedMetrics?.minutes ?? 0;

    const preview = this.applyEventDelta(state.source, state.type, deltaDays, deltaMinutes);
    if (!this.isWithinBounds(preview)) return;

    state.preview = preview;
    state.deltaDays = deltaDays;
    state.deltaMinutes = deltaMinutes;
    this.renderCalendar(this.view);
  }

  private finishEventInteraction(ev: PointerEvent, cancelled: boolean) {
    const state = this.interaction;
    if (!state) return;
    if (!cancelled) this.updateEventInteraction(ev);

    const changed = !this.sameEventValue(state.source, state.preview);
    this.interaction = null;

    if (!cancelled && changed) {
      const updated = this._events.map((event) =>
        this.sameEvent(event, state.source) ? state.preview : event,
      );
      this._events = updated;
      this.eventChange.emit({
        event: state.preview,
        previousEvent: state.previousEvent,
        interaction: state.type,
        deltaDays: state.deltaDays,
        deltaMinutes: state.deltaMinutes,
      });
      this.eventsChange.emit(updated);
    }

    this.renderCalendar(this.view);
  }

  private cancelEventInteraction() {
    if (!this.interaction) return;
    this.interaction = null;
  }

  private monthPointerDelta(ev: PointerEvent): { days: number } | null {
    if (!this.interaction || this.view !== 'month') return null;
    const root = this.calendarWrapper()?.nativeElement.querySelector<HTMLElement>('.days');
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    const cellWidth = rect.width / MONTH_COLUMN_COUNT;
    const cellHeight = rect.height / MONTH_ROW_COUNT;
    const startColumn = Math.max(
      0,
      Math.min(
        MONTH_COLUMN_COUNT - 1,
        Math.floor((this.interaction.startX - rect.left) / cellWidth),
      ),
    );
    const currentColumn = Math.max(
      0,
      Math.min(MONTH_COLUMN_COUNT - 1, Math.floor((ev.clientX - rect.left) / cellWidth)),
    );
    const startRow = Math.max(
      0,
      Math.min(MONTH_ROW_COUNT - 1, Math.floor((this.interaction.startY - rect.top) / cellHeight)),
    );
    const currentRow = Math.max(
      0,
      Math.min(MONTH_ROW_COUNT - 1, Math.floor((ev.clientY - rect.top) / cellHeight)),
    );
    return { days: (currentRow - startRow) * 7 + (currentColumn - startColumn) };
  }

  private allDayPointerDelta(ev: PointerEvent): { days: number } | null {
    if (!this.interaction || this.view === 'month' || this.view === 'event') return null;
    const root = this.calendarWrapper()?.nativeElement.querySelector<HTMLElement>('.all-day-row');
    if (!root) return null;
    const columns = Array.from(root.querySelectorAll('.all-day-cell')) as HTMLElement[];
    if (!columns.length) return null;
    const indexAt = (x: number) => {
      const index = columns.findIndex((column) => {
        const rect = column.getBoundingClientRect();
        return x >= rect.left && x <= rect.right;
      });
      return index < 0 ? 0 : index;
    };
    return { days: indexAt(ev.clientX) - indexAt(this.interaction.startX) };
  }

  private timedPointerDelta(ev: PointerEvent): { days: number; minutes: number } | null {
    if (!this.interaction || (this.view !== 'day' && this.view !== 'week')) return null;
    const root = this.calendarWrapper()?.nativeElement.querySelector<HTMLElement>('.time-grid');
    if (!root) return null;
    const columns = Array.from(root.querySelectorAll('.day-column')) as HTMLElement[];
    if (!columns.length) return null;

    const startColumn = this.columnAtPoint(
      columns,
      this.interaction.startX,
      this.interaction.startY,
    );
    const currentColumn = this.columnAtPoint(columns, ev.clientX, ev.clientY);
    const startIndex = startColumn ?? 0;
    const currentIndex = currentColumn ?? startIndex;
    const rect = (columns[currentIndex] ?? columns[0]).getBoundingClientRect();
    const startRect = (columns[startIndex] ?? columns[0]).getBoundingClientRect();
    const startMinute = this.snapMinutes(
      ((this.interaction.startY - startRect.top) / HALF_HOUR_HEIGHT) * 30,
    );
    const currentMinute = this.snapMinutes(((ev.clientY - rect.top) / HALF_HOUR_HEIGHT) * 30);
    return { days: currentIndex - startIndex, minutes: currentMinute - startMinute };
  }

  private columnAtPoint(columns: HTMLElement[], x: number, y: number): number | null {
    const index = columns.findIndex((column) => {
      const rect = column.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
    return index < 0 ? null : index;
  }

  private snapMinutes(minutes: number): number {
    return Math.max(0, Math.min(24 * 60, Math.round(minutes / 30) * 30));
  }

  private applyEventDelta(
    source: MsEvents,
    type: CalendarEventInteractionType,
    deltaDays: number,
    deltaMinutes: number,
  ): MsEvents {
    const normalized = this.normalizeEvent(source);
    let start = new Date(normalized.start);
    let end = new Date(normalized.end);

    if (type === 'move') {
      start = this.addMinutes(this.addDays(start, deltaDays), deltaMinutes);
      end = this.addMinutes(this.addDays(end, deltaDays), deltaMinutes);
    } else if (type === 'resize-start') {
      start = this.addMinutes(this.addDays(start, deltaDays), deltaMinutes);
      if (start.getTime() > end.getTime() - MIN_EVENT_MINUTES * 60_000) {
        start = new Date(end.getTime() - MIN_EVENT_MINUTES * 60_000);
      }
    } else {
      end = this.addMinutes(this.addDays(end, deltaDays), deltaMinutes);
      if (end.getTime() < start.getTime() + MIN_EVENT_MINUTES * 60_000) {
        end = new Date(start.getTime() + MIN_EVENT_MINUTES * 60_000);
      }
    }

    return { ...source, start, end };
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60_000);
  }

  private isWithinBounds(event: MsEvents): boolean {
    const n = this.normalizeEvent(event);
    if (this.minDate && compareDate(n.start, this.minDate) < 0) return false;
    if (this.maxDate && compareDate(n.end, this.maxDate) > 0) return false;
    return true;
  }

  private sameEvent(a: MsEvents, b: MsEvents): boolean {
    return a.id != null && b.id != null ? a.id === b.id : a === b;
  }

  private sameEventValue(a: MsEvents, b: MsEvents): boolean {
    const aa = this.normalizeEvent(a);
    const bb = this.normalizeEvent(b);
    return aa.start.getTime() === bb.start.getTime() && aa.end.getTime() === bb.end.getTime();
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
