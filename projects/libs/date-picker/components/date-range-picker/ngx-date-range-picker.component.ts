import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { compareDate, deserialize, isValid, sameDate } from '../../helpers/date.helper';
import {
  isCompleteDateRange,
  isDateInPreviewRange,
  isDateInRange,
  normalizeDateRange,
} from '../../helpers/date-range.helper';
import { DateViewDay, DateViewMonth, DateViewYear } from '../../models/date';
import { CalendarView, DatePickerView } from '../../models/view';
import { NgxDateRange } from '../../models/range';
import { NgxDatePickerConfig } from '../config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';

@Component({
  selector: 'ngx-date-range-picker',
  standalone: true,
  templateUrl: './ngx-date-range-picker.component.html',
  styleUrls: ['./ngx-date-range-picker.component.scss'],
  imports: [CommonModule],
  providers: [
    DateAdapterRegistry,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDateRangePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxDateRangePickerComponent),
      multi: true,
    },
  ],
})
export class NgxDateRangePickerComponent
  extends NgxDatePickerBase
  implements ControlValueAccessor, Validator, OnInit
{
  config = new NgxDatePickerConfig();

  @Input() set locale(value: string) {
    this._locale = value || 'en';
    this.adapter = this.dateAdapterRegistry.resolve(this._locale);
    this.init();
  }

  @Input() set min(value: Date | null | undefined) {
    const next = deserialize(value);
    if (!sameDate(next, this.minDate)) {
      this.minDate = next;
      this._validatorOnChange();
      this.renderCalendar(this.view);
    }
  }

  @Input() set max(value: Date | null | undefined) {
    const next = deserialize(value);
    if (!sameDate(next, this.maxDate)) {
      this.maxDate = next;
      this._validatorOnChange();
      this.renderCalendar(this.view);
    }
  }

  @Input() view: 'year' | 'month' | 'day' = 'day';

  @Output() rangeChange = new EventEmitter<NgxDateRange<Date>>();
  @Output() change = new EventEmitter<NgxDateRange<Date>>();

  range: NgxDateRange<Date> = { start: null, end: null };
  hoverDate: Date | null = null;

  weekDays: { min: string; name: string }[] = [];
  calendarHeader = '';

  protected _onChange = (_value: NgxDateRange<Date>) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};
  isDisabled = false;

  ngOnInit(): void {
    this.init();
  }

  updateConfig(value: NgxDatePickerConfig) {
    this.config = { ...new NgxDatePickerConfig(), ...value };
  }

  writeValue(value: NgxDateRange<Date> | readonly [Date | null, Date | null] | null): void {
    this.range = normalizeDateRange(value);
    this.init();
  }

  registerOnChange(fn: (value: NgxDateRange<Date>) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    const { start, end } = this.range;

    if (start && !isValid(start)) return { invalid: true };
    if (end && !isValid(end)) return { invalid: true };

    if (start && this.minDate && compareDate(start, this.minDate) < 0) {
      return { min: this.minDate };
    }
    if (start && this.maxDate && compareDate(start, this.maxDate) > 0) {
      return { max: this.maxDate };
    }
    if (end && this.minDate && compareDate(end, this.minDate) < 0) {
      return { min: this.minDate };
    }
    if (end && this.maxDate && compareDate(end, this.maxDate) > 0) {
      return { max: this.maxDate };
    }
    if (start && end && compareDate(start, end) > 0) {
      return { range: true };
    }

    return null;
  }

  override renderCalendar(view: CalendarView | DatePickerView) {
    super.renderCalendar(view, undefined, [], () => {
      this.applyRangeState();
      const start = this.range.start;
      const end = this.range.end;
      const startText = start
        ? this.adapter.formatDate(this.adapter.toLocale(start), 'EEEE, d MMMM, yyyy')
        : '';
      const endText = end
        ? this.adapter.formatDate(this.adapter.toLocale(end), 'EEEE, d MMMM, yyyy')
        : '';

      this.calendarHeader = endText
        ? `${startText} – ${endText}`
        : startText || 'Select date range';
    });
  }

  private init() {
    this.months = this.adapter.longMonths;
    const shortDays = this.adapter.shortDays;
    const longDays = this.adapter.longDays;
    this.weekDays = shortDays.map((min, i) => ({ min, name: longDays[i] }));

    const anchor = this.range.end || this.range.start || this.adapter.getDate(this.adapter.today());
    const locale = this.adapter.toLocale(anchor);
    this.currYear = locale.year;
    this.currMonth = locale.month ?? 0;
    this.renderCalendar(this.view);
  }

  changeView(view: 'year' | 'month' | 'day') {
    this.view = view;
    this.renderCalendar(view);
  }

  gotoToday() {
    const today = this.adapter.today();
    const date = today.date ?? this.adapter.getDate(today);
    this.currYear = today.year;
    this.currMonth = today.month ?? 0;

    // Keep an existing completed range; today is only a navigation shortcut.
    if (!this.range.start || this.range.end) {
      this.range = { start: date, end: null };
      this.emitValue();
    }

    this.changeView('day');
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
  selectDay(event: Event, item: DateViewDay) {
    event.stopPropagation();
    if (!item.active || !item.date || this.isDisabled) return;

    const date = item.date;

    if (!this.range.start || this.range.end) {
      this.range = { start: date, end: null };
    } else {
      this.range =
        compareDate(date, this.range.start) < 0
          ? { start: date, end: this.range.start }
          : { start: this.range.start, end: date };

      this.hoverDate = null;
    }

    this.applyRangeState();
    this.emitValue();

    if (isCompleteDateRange(this.range)) {
      this._onTouched();
    }
  }

  selectMonth(event: Event, item: DateViewMonth) {
    event.stopPropagation();
    if (item.active) {
      this.currMonth = item.month;
      this.changeView('day');
    }
  }

  selectYear(event: Event, item: DateViewYear) {
    event.stopPropagation();
    if (item.active) {
      this.currYear = item.year;
      this.changeView('month');
    }
  }

  onDayEnter(item: DateViewDay) {
    if (this.range.start && !this.range.end && item.active) {
      this.hoverDate = item.date ?? null;
      this.applyRangeState();
    }
  }

  onDayLeave() {
    if (this.hoverDate) {
      this.hoverDate = null;
      this.applyRangeState();
    }
  }

  clear() {
    this.range = { start: null, end: null };
    this.hoverDate = null;
    this.applyRangeState();
    this.emitValue();
    this._onTouched();
  }

  private applyRangeState() {
    for (const item of this.viewDays) {
      if (!item.date) continue;

      item.rangeStart = !!this.range.start && sameDate(item.date, this.range.start);
      item.rangeEnd = !!this.range.end && sameDate(item.date, this.range.end);
      item.inRange = isDateInRange(item.date, this.range);
      item.inRangePreview =
        !this.range.end && isDateInPreviewRange(item.date, this.range.start, this.hoverDate);

      item.selected = !!item.rangeStart || !!item.rangeEnd;
    }
  }

  private emitValue() {
    const value = { ...this.range };
    this._onChange(value);
    this.rangeChange.emit(value);
    this.change.emit(value);
  }

  stopPagination(event: Event) {
    event.stopPropagation();
  }
}
