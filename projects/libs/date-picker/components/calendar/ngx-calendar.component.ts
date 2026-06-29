import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxDatePickerConfig } from '../config';
import { JalaliDateAdapter } from '../../adapters/jalali-adapter';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { DateAdapter } from '../../adapters/date.adapter';
import { MsViewYear } from '../../models/view-year';
import { MsViewMonth } from '../../models/view-month';
import { MsViewDay } from '../../models/view-day';
import { MsEvents } from '../../models/events';
import { MsView } from '../../models/view';
import { ISelectedEvent } from '../../models/selected-event';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'ngx-calendar',
  templateUrl: './ngx-calendar.component.html',
  styleUrls: ['./ngx-calendar.component.scss'],
  imports: [CommonModule],
})
export class NgxCalendarComponent extends NgxDatePickerBase implements OnInit, AfterViewInit {
  _config = new NgxDatePickerConfig();
  @Input() set config(val: NgxDatePickerConfig) {
    this._config = { ...new NgxDatePickerConfig(), ...val };
  }
  protected supportedLocale = ['en', 'fa'];
  @Input() set locale(val: 'fa' | 'en') {
    let i = this.supportedLocale.indexOf(val);
    if (i < 0) i = 0;
    if (this._locale !== this.supportedLocale[i]) {
      this._locale = this.supportedLocale[i];
      this.ngOnInit();
    }
  }
  @Input() view: MsView = 'day';
  _events: MsEvents[] = [];
  @Input() set events(val: MsEvents[]) {
    if (val && Array.isArray(val)) {
      this._events = val;
    }
  }

  @Output() dateChange = new EventEmitter<MsViewDay>();
  @Output() selectEvent = new EventEmitter<ISelectedEvent>();

  defaultHeight = 600;
  minHeight = this.defaultHeight;
  weeks: string[] = [];

  selected?: Date;

  // @ViewChild('datepickerWrapper', { static: false }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('daysContainer', { static: false })
  daysContainer!: ElementRef<HTMLElement>;
  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this._locale === 'fa') {
      this.adapter = new JalaliDateAdapter();
    } else {
      this.adapter = new DateAdapter();
    }
    this.months = this.adapter.longMonths;
    this.weeks = this.adapter.longDays;
    if (this.selected) {
      let converted = this.adapter.getOutputDate(this.selected);
      this.currYear = converted.year;
      this.currMonth = converted.month!;
    } else {
      this.gotoToday();
    }
  }

  ngAfterViewInit(): void {
    this.renderCalendar(this.view);
    this.calcCellSize();
  }

  @HostListener('window:resize', ['$event']) onResize(ev: Event) {
    this.calcCellSize();
  }

  calcCellSize() {
    const fullWidth = this.daysContainer.nativeElement.clientWidth;
    const cellHeight = fullWidth / 6;
    this.minHeight = fullWidth > this.defaultHeight ? this.defaultHeight : fullWidth;
    if (fullWidth <= 500) {
      this.weeks = this.adapter.shortDays;
    } else if (fullWidth > 500) {
      this.weeks = this.adapter.longDays;
    }
  }
  override renderCalendar(view: 'year' | 'month' | 'day') {
    console.log('_events', this._events);
    super.renderCalendar(view, undefined, this._events, () => {});
  }

  changeView(v: MsView) {
    this.view = v;
    this.renderCalendar(this.view);
  }

  gotoToday() {
    this.selected = this.adapter.getDate(this.adapter.today);
    this.currYear = this.adapter.today.year;
    this.currMonth = this.adapter.today.month;
    this.changeView('day');
  }

  selectDay(ev: Event, item: MsViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.dateChange.emit(item);
    }
  }
  selectMonth(ev: Event, item: MsViewMonth) {
    ev.stopPropagation();
    if (item.active) {
      this.currMonth = item.month;
      this.changeView('day');
    }
  }
  selectYear(ev: Event, item: MsViewYear) {
    ev.stopPropagation();
    if (item.active) {
      this.currYear = item.year;
      this.changeView('month');
    }
  }

  next() {
    if (this.view === 'year') {
      this.currYear += 20;
    } else if (this.view === 'month') {
      this.currYear++;
    } else {
      this.currMonth++;
    }
    if (this.currMonth < 0 || this.currMonth > 11) {
      this.date = new Date(this.currYear, this.currMonth);
      this.currYear = this.date.getFullYear();
      this.currMonth = this.date.getMonth();
    } else {
      this.date = new Date();
    }

    this.renderCalendar(this.view);
  }

  previous() {
    if (this.view === 'year') {
      this.currYear -= 20;
    } else if (this.view === 'month') {
      this.currYear--;
    } else {
      this.currMonth--;
    }
    if (this.currMonth < 0 || this.currMonth > 11) {
      this.date = new Date(this.currYear, this.currMonth);
      this.currYear = this.date.getFullYear();
      this.currMonth = this.date.getMonth();
    } else {
      this.date = new Date();
    }

    this.renderCalendar(this.view);
  }

  onclickEvent(item: MsViewDay, event: MsEvents) {
    this.selectEvent.emit({
      date: item.date!,
      event: event,
    });
  }
}
