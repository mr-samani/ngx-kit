import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { DateAdapter } from '../../adapters/date.adapter';
import { JalaliDateAdapter } from '../../adapters/jalali-adapter';
import { deserialize } from '../../helpers/date.helper';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { MsViewDay } from '../../models/view-day';
import { MsViewMonth } from '../../models/view-month';
import { MsViewYear } from '../../models/view-year';
import { MsView } from '../../models/view';
import { IOutputDate } from '../../adapters/IOutputDate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: './ngx-datepicker.component.html',
  styleUrls: ['./ngx-datepicker.component.scss'],
  imports: [CommonModule],
})
export class NgxInputDatePickerComponent extends NgxDatePickerBase implements OnInit {
  _config = new NgxDatePickerConfig();
  @Input() set config(val: NgxDatePickerConfig) {
    this._config = { ...new NgxDatePickerConfig(), ...val };
  }
  protected supportedLocale = ['en', 'fa'];
  @Input() set locale(val: 'fa' | 'en') {
    let i = this.supportedLocale.indexOf(val);
    if (i < 0) i = 0;
    this._locale = this.supportedLocale[i];
    this.ngOnInit();
  }
  @Input() view: MsView = 'day';

  @Output() dateChange = new EventEmitter<any>();
  wrapperWidth = 40 * 7 + 20;

  selected?: IOutputDate;

  calendarHeader = '';
  isDisabled = false;
  showPanel = signal(false);
  panelLeft?: number;
  panelTop?: number;

  // storing full name of all months in array
  minWeeks: string[] = [];
  @ViewChild('datepickerWrapper') datepickerWrapper?: ElementRef<HTMLElement>;
  constructor(public _elementRef: ElementRef<HTMLDivElement>) {
    super();
  }

  ngOnInit(): void {
    if (this._locale === 'fa') {
      this.adapter = new JalaliDateAdapter();
    } else {
      this.adapter = new DateAdapter();
    }
    this.months = this.adapter.longMonths;
    this.minWeeks = this.adapter.shortDays;
    if (!this.selected) {
      this.gotoToday();
    } else {
      this.renderCalendar(this.view);
    }
  }

  override renderCalendar(view: 'year' | 'month' | 'day') {
    super.renderCalendar(view, this.selected, [], () => {
      let d = deserialize(this.value);
      this.calendarHeader =
        (d && this.adapter.formatDate(this.adapter.getOutputDate(d), 'EEEE, d MMMM, yyyy')) ?? '';
      this.fixPosition();
    });
  }
  get value(): string {
    return this.selected ? this.adapter.getDate(this.selected).toISOString() : '';
  }
  get _date() {
    return this.date;
  }

  set _date(val: Date | null) {
    if (val) {
      this.date = val;
      this.setDate();
    }
  }

  updateConfig(val: NgxDatePickerConfig) {
    this.config = val;
  }

  gotoToday() {
    this.selected = this.adapter.today;
    this.currYear = this.adapter.today.year;
    this.currMonth = this.adapter.today.month;
    this.calendarHeader = this.adapter.formatDate(this.adapter.today, 'EEEE, d MMMM, yyyy') ?? '';
    this.changeView('day');
  }

  changeView(v: MsView) {
    this.view = v;
    this.renderCalendar(this.view);
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

  selectDay(ev: Event, item: MsViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.selected = {
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth,
        day: item.day,
      };
      this.dateChange.emit(this.value);
      this.showPanel.set(false);
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
  private setDate() {
    let date = deserialize(this.date);
    if (date) {
      const d = this.adapter.getOutputDate(date);
      this.currYear = d.year;
      this.currMonth = d.month ?? 0;
      this.selected = d;
      this.renderCalendar(this.view);
    } else {
      this.gotoToday();
    }
  }

  clear() {
    this.selected = undefined;
    this.dateChange.emit('');
    this.showPanel.set(false);
  }
  stopPagination(ev: Event) {
    ev.stopPropagation();
  }
  public openPanel() {
    this.showPanel.set(true);
    this.setDate();
  }
  public closePanel() {
    this.showPanel.set(false);
  }
  public togglePanel() {
    debugger;
    if (this.showPanel()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  fixPosition() {
    setTimeout(() => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      let top = this.panelTop ?? 0;
      const datepickerH = this.datepickerWrapper?.nativeElement.offsetHeight ?? 0;
      if (top + datepickerH > vh) {
        top = vh - datepickerH;
        this.panelTop = top;
      }
    });
  }
}
