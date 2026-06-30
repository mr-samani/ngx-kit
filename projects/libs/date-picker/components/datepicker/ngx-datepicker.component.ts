import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { clampDate, deserialize, isValid, sameDate } from '../../helpers/date.helper';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { MsViewDay } from '../../models/view-day';
import { MsViewMonth } from '../../models/view-month';
import { MsViewYear } from '../../models/view-year';
import { MsView } from '../../models/view';
import { CalendarDate } from '../../adapters/calendar-date';
import { CommonModule } from '@angular/common';
import { BrowserService } from 'ngx-kit/shared';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DateAdapterRegistry } from 'ngx-kit/date-picker/adapters/date-adapter-registry';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: './ngx-datepicker.component.html',
  styleUrls: ['./ngx-datepicker.component.scss'],
  imports: [CommonModule],
  providers: [
    DateAdapterRegistry,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputDatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputDatePickerComponent),
      multi: true,
    },
  ],
})
export class NgxInputDatePickerComponent
  extends NgxDatePickerBase
  implements ControlValueAccessor, Validator, OnInit
{
  browserService = inject(BrowserService);

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
      this._validatorOnChange();
    }
  }

  /** The maximum valid date. */
  @Input('max') set setMax(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.maxDate)) {
      this.maxDate = validValue;
      this._validatorOnChange();
    }
  }

  @Input() view: MsView = 'day';

  @Output() change = new EventEmitter<Date | null>();

  wrapperWidth = 40 * 7 + 20;

  selected?: CalendarDate;

  calendarHeader = '';
  isDisabled = false;

  // storing full name of all months in array
  minWeeks: string[] = [];
  _onChange = (value: Date) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};
  constructor(public _elementRef: ElementRef<HTMLDivElement>) {
    super();
  }

  ngOnInit(): void {
    this.months = this.adapter.longMonths;
    this.minWeeks = this.adapter.shortDays;
    if (!this.selected) {
      this.gotoToday();
    } else {
      this.renderCalendar(this.view);
    }
  }
  writeValue(value: any): void {
    const validValue = deserialize(value);
    if (validValue) {
      this._date = validValue;
    }
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.value) {
      if (!isValid(this.value)) {
        return {
          invalid: true,
        };
      }
      let c = clampDate(this._date, this.minDate, this.maxDate);
      if (c < 0) {
        return {
          invalid: true,
          min: this.minDate,
        };
      } else if (c > 0) {
        return {
          invalid: true,
          max: this.maxDate,
        };
      }
    }
    return null;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this._validatorOnChange = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  override renderCalendar(view: 'year' | 'month' | 'day') {
    super.renderCalendar(view, this.selected, [], () => {
      let d = deserialize(this.value);
      this.calendarHeader =
        (d && this.adapter.formatDate(this.adapter.getOutputDate(d), 'EEEE, d MMMM, yyyy')) ?? '';
    });
  }
  get value(): string {
    return this.selected ? this.adapter.getDate(this.selected).toISOString() : '';
  }

  get _date(): Date | null | undefined {
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
    let today = this.adapter.today();
    this.selected = today;
    this.currYear = today.year;
    this.currMonth = today.month;
    this.calendarHeader = this.adapter.formatDate(today, 'EEEE, d MMMM, yyyy') ?? '';
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
      this.change.emit(this._date);
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
    this.change.emit(null);
  }
  stopPagination(ev: Event) {
    ev.stopPropagation();
  }
}
