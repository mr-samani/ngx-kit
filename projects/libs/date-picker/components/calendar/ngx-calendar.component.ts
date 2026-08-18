import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  viewChild,
  ViewChild,
} from '@angular/core';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { MsEvents } from '../../models/events';
import { CalendarView } from '../../models/view';
import { ISelectedEvent } from '../../models/selected-event';
import { CommonModule } from '@angular/common';
import { deserialize, sameDate } from '../../helpers/date.helper';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { DateViewDay, DateViewMonth, DateViewYear } from '../../models/date';
import { BrowserService } from 'ngx-kit/shared';
@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar.component.html',
  styleUrls: ['./ngx-calendar.component.scss'],
  imports: [CommonModule],
  providers: [DateAdapterRegistry],
  host: {
    '[class.dark]': 'theme=="dark"',
  },
})
export class NgxCalendarComponent extends NgxDatePickerBase implements OnInit, AfterViewInit {
  protected readonly browserService = inject(BrowserService);

  theme: 'light' | 'dark' = this.browserService.prefersDarkMode ? 'dark' : 'light';
  @Input('theme') set setTheme(val: 'light' | 'dark' | 'auto') {
    if (!val || val == 'auto') {
      this.theme = this.browserService.prefersDarkMode ? 'dark' : 'light';
    } else {
      this.theme = val;
    }
  }
  _config = new NgxDatePickerConfig();
  @Input() set config(val: NgxDatePickerConfig) {
    this._config = { ...new NgxDatePickerConfig(), ...val };
  }
  @Input() set locale(val: string) {
    this._locale = val;
    this.adapter = this.dateAdapterRegistry.resolve(this._locale);
    this.ngOnInit();
  }
  /** The minimum valid date. */
  @Input('min') set setMin(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.minDate)) {
      this.minDate = validValue;
    }
  }

  /** The maximum valid date. */
  @Input('max') set setMax(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.maxDate)) {
      this.maxDate = validValue;
    }
  }

  @Input() view: CalendarView = 'day';
  _events: MsEvents[] = [];
  @Input() set events(val: MsEvents[]) {
    if (val && Array.isArray(val)) {
      this._events = val;
    }
  }

  @Output() dateChange = new EventEmitter<DateViewDay>();
  @Output() selectEvent = new EventEmitter<ISelectedEvent>();

  defaultHeight = 600;
  minHeight = this.defaultHeight;

  selected?: Date;

  calendarWrapper = viewChild<ElementRef<HTMLElement>>('calendarWrapper');
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
    if (this.selected) {
      let converted = this.adapter.toLocale(this.selected);
      this.currYear = converted.year;
      this.currMonth = converted.month!;
      this.renderCalendar(this.view);
    } else {
      this.gotoToday();
    }
  }

  ngAfterViewInit(): void {
    this.calcCellSize();
  }

  @HostListener('window:resize', ['$event']) onResize(ev: Event) {
    this.calcCellSize();
  }

  calcCellSize() {
    const fullWidth = this.calendarWrapper()?.nativeElement?.clientWidth ?? 0;
    const cellHeight = fullWidth / 6;
    this.minHeight = fullWidth > this.defaultHeight ? this.defaultHeight : fullWidth;
    if (fullWidth <= 500) {
      this.weeks = this.adapter.shortDays;
    } else if (fullWidth > 500) {
      this.weeks = this.adapter.longDays;
    }
  }
  override renderCalendar(view: CalendarView) {
    // console.log('_events', this._events);
    super.renderCalendar(view, undefined, this._events, () => {});
  }

  changeView(v: CalendarView) {
    this.view = v;
    this.renderCalendar(this.view);
  }

  gotoToday() {
    let today = this.adapter.today();
    this.selected = this.adapter.getDate(today);
    this.currYear = today.year;
    this.currMonth = today.month ?? 1;
    this.changeView(this.view);
  }

  selectDay(ev: Event, item: DateViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.dateChange.emit(item);
    }
  }
  selectMonth(ev: Event, item: DateViewMonth) {
    ev.stopPropagation();
    if (item.active) {
      this.currMonth = item.month;
      this.changeView('day');
    }
  }
  selectYear(ev: Event, item: DateViewYear) {
    ev.stopPropagation();
    if (item.active) {
      this.currYear = item.year;
      this.changeView('month');
    }
  }

  next() {
    if (this.view === 'month' || this.view == 'event') {
      this.currMonth++;
    } else if (this.view == 'day' || this.view == 'week') {
      this.currentWeek++;
    }
    if (this.currMonth < 0 || this.currMonth > 11) {
      let date = new Date(this.currYear, this.currMonth);
      this.currYear = date.getFullYear();
      this.currMonth = date.getMonth();
    }

    this.renderCalendar(this.view);
  }

  previous() {
    if (this.view === 'month' || this.view == 'event') {
      this.currMonth--;
    } else if (this.view == 'day' || this.view == 'week') {
      this.currentWeek--;
    }
    if (this.currMonth < 0 || this.currMonth > 11) {
      let date = new Date(this.currYear, this.currMonth);
      this.currYear = date.getFullYear();
      this.currMonth = date.getMonth();
    }

    this.renderCalendar(this.view);
  }

  onclickEvent(item: DateViewDay, event: MsEvents) {
    this.selectEvent.emit({
      date: item.date!,
      event: event,
    });
  }
}
