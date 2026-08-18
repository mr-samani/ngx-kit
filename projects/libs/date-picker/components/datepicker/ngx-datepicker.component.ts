import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { clampDate, deserialize, isValid, sameDate } from '../../helpers/date.helper';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';
import { DatePickerView } from '../../models/view';
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
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { DateViewDay, DateViewMonth, DateViewYear } from '../../models/date';

@Component({
  selector: 'ngx-date-picker',
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
  host: {
    '[class.dark]': 'theme=="dark"',
  },
})
export class NgxInputDatePickerComponent
  extends NgxDatePickerBase
  implements ControlValueAccessor, Validator, OnInit
{
  protected readonly browserService = inject(BrowserService);

  theme: 'light' | 'dark' = this.browserService.prefersDarkMode ? 'dark' : 'light';
  @Input('theme') set setTheme(val: 'light' | 'dark' | 'auto') {
    if (!val || val == 'auto') {
      this.theme = this.browserService.prefersDarkMode ? 'dark' : 'light';
    } else {
      this.theme = val;
    }
  }

  config = new NgxDatePickerConfig();
  @Input('config') set setConfig(val: NgxDatePickerConfig) {
    this.config = { ...new NgxDatePickerConfig(), ...val };
  }

  @Input() set locale(val: string) {
    this._locale = val;
    this.adapter = this.dateAdapterRegistry.resolve(this._locale);
    this.init();
  }
  /** The minimum valid date. */
  @Input('min') set setMin(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.minDate)) {
      this.minDate = validValue;
      this._validatorOnChange();
      this.init();
    }
  }

  /** The maximum valid date. */
  @Input('max') set setMax(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.maxDate)) {
      this.maxDate = validValue;
      this._validatorOnChange();
      this.init();
    }
  }

  @Input() view: DatePickerView = 'day';

  @Output() change = new EventEmitter<Date | null>();

  wrapperWidth = 40 * 7 + 20;

  selected?: CalendarDate;

  calendarHeader = '';
  isDisabled = false;

  weekDays: { min: string; name: string }[] = [];
  protected _onChange = (value: Date) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }
  updateConfig(val: NgxDatePickerConfig) {
    this.config = { ...new NgxDatePickerConfig(), ...val };
  }
  init() {
    this.months = this.adapter.longMonths;
    let sDays = this.adapter.shortDays;
    let lDays = this.adapter.longDays;
    this.weekDays = sDays.map((m, i) => ({ min: m, name: lDays[i] }));

    if (!this.selected?.date) {
      this.gotoToday();
    } else {
      let l = this.adapter.toLocale(this.selected.date);
      this.currYear = l.year;
      this.currMonth = l.month ?? 1;
      this.renderCalendar(this.view);
    }
  }
  writeValue(value: any): void {
    const validValue = deserialize(value);
    if (validValue) {
      this.selected = this.adapter.toLocale(validValue);
    } else {
      this.selected = undefined;
    }
    this.init();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.selected?.date) {
      if (!isValid(this.selected.date)) {
        return {
          invalid: true,
        };
      }
      let c = clampDate(this.selected?.date, this.minDate, this.maxDate);
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
      let d = this.selected?.date;
      this.calendarHeader =
        (d && this.adapter.formatDate(this.adapter.toLocale(d), 'EEEE - d MMMM, yyyy')) ?? '';
    });
  }

  gotoToday() {
    let today = this.adapter.today();
    this.selected = today;
    this.currYear = today.year;
    this.currMonth = today.month ?? 1;
    this.calendarHeader = this.adapter.formatDate(today, 'EEEE, d MMMM, yyyy') ?? '';
    this.changeView('day');
  }

  changeView(v: DatePickerView) {
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
      let date = new Date(this.currYear, this.currMonth);
      this.currYear = date.getFullYear();
      this.currMonth = date.getMonth();
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
      let date = new Date(this.currYear, this.currMonth);
      this.currYear = date.getFullYear();
      this.currMonth = date.getMonth();
    }

    this.renderCalendar(this.view);
  }

  selectDay(ev: Event, item: DateViewDay) {
    ev.stopPropagation();
    if (item.active) {
      this.selected = {
        locale: this._locale,
        year: this.currYear,
        month: this.currMonth,
        day: item.day,
        date: item.date,
      };
      this.change.emit(this.selected.date);
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

  clear() {
    this.selected = undefined;
    this.change.emit(null);
  }
  stopPagination(ev: Event) {
    ev.stopPropagation();
  }
}
