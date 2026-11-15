import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGX_DATE_CONFIG, NgxCalendarLocalization, NgxDateConfig } from '../../tokens/config';
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
import { sameDate, compareDate } from '../../helpers/date.helper';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';

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
  /** where the gesture started, measured ONCE when it began (see beginInteraction) */
  originColumn: number;
  originRow: number;
  originMinute: number;
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
export class NgxCalendarComponent extends NgxDatePickerBase implements OnInit, OnDestroy {
  resizeAndMovable = input<boolean>(false);

  private _view: CalendarView = 'month';
  /** Active view. Changing it from the parent re-renders the calendar. */
  @Input() set view(v: CalendarView) {
    if (v === this._view) return;
    this._view = v;
    if (this.anchorDate()) this.renderCalendar(v);
  }
  get view(): CalendarView {
    return this._view;
  }

  private _events: MsEvents[] = [];
  @Input() set events(val: MsEvents[]) {
    this._events = Array.isArray(val) ? val : [];
    if (this.anchorDate()) this.renderCalendar(this.view);
  }
  get events(): MsEvents[] {
    return this._events;
  }

  @Output() dateChange = new EventEmitter<DateViewDay>();
  @Output() selectEvent = new EventEmitter<ISelectedEvent>();
  @Output() eventChange = new EventEmitter<CalendarEventChange>();
  @Output() eventsChange = new EventEmitter<MsEvents[]>();

  selected?: Date;
  // Todo: change to signal
  anchorDate = signal<Date | undefined>(undefined);

  eventViewItems: { event: MsEventViewer; start: Date; end: Date }[] = [];
  monthEventSegments: CalendarMonthEventSegment[] = [];
  monthEventRows: CalendarMonthEventSegment[][] = Array.from({ length: MONTH_ROW_COUNT }, () => []);
  // Todo: change to signal
  weekDays: CalendarDayColumn[] = [];
  allDayByColumn: CalendarTimedEvent[][] = [];
  timeSlots = Array.from({ length: 48 }, (_, i) => i * 30);
  readonly hourHeight = HOUR_HEIGHT;
  readonly timeColumnWidth = 64;

  calendarWrapper = viewChild<ElementRef<HTMLElement>>('calendarWrapper');

  protected interaction: EventInteractionState | null = null;

  constructor() {
    super();
    effect(() => {
      const locale = this.locale();
      // Only the locale is a dependency; the rendering below reads/writes signals itself.
      untracked(() => {
        this.adapter = this.dateAdapterRegistry.resolve(locale);
        if (this.currYear() !== undefined) this.syncAnchorToLocale();
        this.renderCalendar(this.view);
      });
    });
  }

  ngOnInit(): void {
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
    this.anchorDate.set(
      this.selected ? new Date(this.selected) : this.adapter.getDate(this.adapter.today()),
    );
    this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  ngOnDestroy(): void {
    this.stopScrollTracking();
  }

  protected override onDateBoundsChange(): void {
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
    if (!this.anchorDate()) return;

    this.syncAnchorToLocale();

    switch (view) {
      case 'month':
        super.renderCalendar(
          'month',
          this.selected ? this.adapter.toLocale(this.selected) : undefined,
          this.renderEvents,
        );
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

    this.displayMonth.set(this.months[this.currMonth()] ?? '');
    queueMicrotask(() => this.calcCellSize());
  }

  private get renderEvents(): MsEvents[] {
    return this._events;
  }

  private syncAnchorToLocale() {
    if (!this.anchorDate()) return;

    const localeDate = this.adapter.toLocale(this.anchorDate()!);
    this.currYear.set(localeDate.year);
    this.currMonth.set(localeDate.month ?? 0);
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
  }

  private renderTimedView() {
    if (!this.anchorDate()) return;
    const dates = this.getWeekDates(this.anchorDate()!);
    const visibleDates =
      this.view === 'day' ? [new Date(this.startOfDay(this.anchorDate()!))] : dates;

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
      locale: this.locale(),
      year: this.currYear(),
      month: this.currMonth(),
      day: 1,
    });
    const monthEnd = this.adapter.getDate({
      locale: this.locale(),
      year: this.currYear(),
      month: this.currMonth(),
      day: this.adapter.lastDateofMonth(this.currYear(), this.currMonth()),
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
    if (!this.anchorDate()) return '';

    if (this.view === 'day') {
      return this.adapter.formatDate(this.adapter.toLocale(this.anchorDate()!), 'full') ?? '';
    }

    if (this.view === 'week') {
      const days = this.getWeekDates(this.anchorDate()!);
      return this.formatDateRange(days[0], days[6]);
    }

    return `${this.displayMonth()} ${this.currYear()}`;
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
    this.anchorDate.set(this.adapter.getDate(this.adapter.today()));
    this.selected = new Date(this.anchorDate()!);
    this.syncAnchorToLocale();
    this.renderCalendar(this.view);
  }

  selectDay(ev: Event, item: DateViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.selected = item.date;
      this.anchorDate.set(new Date(item.date!));
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
    if (!this.anchorDate()) return;

    const d = new Date(this.anchorDate()!);
    if (this.view === 'month' || this.view === 'event') {
      const locale = this.adapter.toLocale(d);
      this.anchorDate.set(
        this.adapter.getDate({
          locale: this.locale(),
          year: locale.year,
          month: locale.month! + direction,
          day: 1,
        }),
      );
    } else {
      d.setDate(d.getDate() + direction * (this.view === 'week' ? 7 : 1));
      this.anchorDate.set(d);
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
    if (ev.button !== 0 || !this.resizeAndMovable()) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.beginInteraction(ev, segment, type, 'month');
  }

  startTimedEventInteraction(
    ev: PointerEvent,
    event: CalendarTimedEvent,
    type: CalendarEventInteractionType = 'move',
  ) {
    if (ev.button !== 0 || !this.resizeAndMovable()) return;
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
      originMinute: 0,
      preview: { ...source },
      deltaDays: 0,
      deltaMinutes: 0,
      active: true,
      surface: _surface,
    };

    // The pointer origin has to be captured in *content* coordinates now. Comparing the press
    // position (viewport coordinates) with element rectangles measured later is wrong as soon
    // as the page or the time grid scrolls while the gesture is running.
    const origin = this.pointerCell(ev, _surface);
    this.interaction.originColumn = origin.column;
    this.interaction.originRow = origin.row;
    this.interaction.originMinute = origin.minute;

    this.lastPointerEvent = ev;
    this.stopScrollTracking();
    const doc = this.hostEl.nativeElement.ownerDocument;
    // `scroll` does not bubble: listen in the capture phase to also catch inner scrollers
    doc.addEventListener('scroll', this.onScrollDuringInteraction, true);
    this.removeScrollListener = () =>
      doc.removeEventListener('scroll', this.onScrollDuringInteraction, true);
  }

  private lastPointerEvent: PointerEvent | null = null;
  private removeScrollListener?: () => void;

  /** The pointer does not move while the user scrolls, so the preview is refreshed here. */
  private readonly onScrollDuringInteraction = () => {
    if (this.interaction && this.lastPointerEvent) {
      this.updateEventInteraction(this.lastPointerEvent);
    }
  };

  private stopScrollTracking() {
    this.removeScrollListener?.();
    this.removeScrollListener = undefined;
  }

  private updateEventInteraction(ev: PointerEvent) {
    const state = this.interaction;
    if (!state) return;
    this.lastPointerEvent = ev;
    const cell = this.pointerCell(ev, state.surface);
    let deltaDays = 0;
    let deltaMinutes = 0;
    if (state.surface === 'month') {
      deltaDays = (cell.row - state.originRow) * 7 + (cell.column - state.originColumn);
    } else if (state.surface === 'all-day') {
      deltaDays = cell.column - state.originColumn;
    } else {
      deltaDays = cell.column - state.originColumn;
      deltaMinutes = cell.minute - state.originMinute;
    }

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
    this.stopScrollTracking();
    this.lastPointerEvent = null;

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
    this.stopScrollTracking();
    this.lastPointerEvent = null;
  }

  /**
   * Maps a viewport point to the grid cell below it, using the rectangles as they are *right
   * now* (so scrolling is accounted for). Points outside the grid are clamped to its edge cells.
   */
  private pointerCell(
    ev: { clientX: number; clientY: number },
    surface: 'month' | 'timed' | 'all-day',
  ): { column: number; row: number; minute: number } {
    const root = this.calendarWrapper()?.nativeElement;
    const none = { column: 0, row: 0, minute: 0 };
    if (!root) return none;
    const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));

    if (surface === 'month') {
      const grid = root.querySelector<HTMLElement>('.month-grid');
      if (!grid) return none;
      const rect = grid.getBoundingClientRect();
      const cellWidth = rect.width / MONTH_COLUMN_COUNT || 1;
      const cellHeight = rect.height / MONTH_ROW_COUNT || 1;
      // Visual column counted from the left edge. In RTL the first day of the week is the
      // right-most cell, so the data column is the mirrored index.
      const visualColumn = clamp(
        Math.floor((ev.clientX - rect.left) / cellWidth),
        MONTH_COLUMN_COUNT - 1,
      );
      return {
        column: this.isRtl(root) ? MONTH_COLUMN_COUNT - 1 - visualColumn : visualColumn,
        row: clamp(Math.floor((ev.clientY - rect.top) / cellHeight), MONTH_ROW_COUNT - 1),
        minute: 0,
      };
    }

    if (surface === 'all-day') {
      const cells = Array.from(root.querySelectorAll<HTMLElement>('.all-day-row .all-day-cell'));
      return { column: this.columnIndexAtX(cells, ev.clientX), row: 0, minute: 0 };
    }

    const columns = Array.from(root.querySelectorAll<HTMLElement>('.time-grid .day-column'));
    const column = this.columnIndexAtX(columns, ev.clientX);
    const rect = (columns[column] ?? columns[0])?.getBoundingClientRect();
    if (!rect) return none;
    return {
      column,
      row: 0,
      minute: this.snapMinutes(((ev.clientY - rect.top) / HALF_HOUR_HEIGHT) * 30),
    };
  }

  /** Column under `x`; left/right of the grid clamps to the first/last column. */
  private columnIndexAtX(columns: HTMLElement[], x: number): number {
    if (!columns.length) return 0;
    const index = columns.findIndex((column) => {
      const rect = column.getBoundingClientRect();
      return x >= rect.left && x <= rect.right;
    });
    if (index >= 0) return index;
    // Outside the grid: clamp to the visually nearest edge column. In RTL the DOM order is
    // mirrored, so the first column is the right-most one.
    const first = columns[0].getBoundingClientRect();
    const last = columns[columns.length - 1].getBoundingClientRect();
    const leftmost = first.left <= last.left ? 0 : columns.length - 1;
    const rightmost = leftmost === 0 ? columns.length - 1 : 0;
    return x < Math.min(first.left, last.left) ? leftmost : rightmost;
  }

  private isRtl(el: HTMLElement): boolean {
    const view = el.ownerDocument.defaultView;
    return (view ? view.getComputedStyle(el).direction : 'ltr') === 'rtl';
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
