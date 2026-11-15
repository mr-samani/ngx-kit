import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  OnInit,
  Output,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DirectionService } from 'ngx-kit/core';
import { DateAdapterRegistry } from '../../adapters/date-adapter-registry';
import { shiftYearMonth } from '../../helpers/calendar-nav.helper';
import { compareDate, isValid, sameDate } from '../../helpers/date.helper';
import {
  isCompleteDateRange,
  isDateInPreviewRange,
  isDateInRange,
  normalizeDateRange,
} from '../../helpers/date-range.helper';
import { DateViewDay, DateViewMonth, DateViewYear } from '../../models/date';
import { DatePickerView } from '../../models/view';
import { NgxDateRange } from '../../models/range';
import { NgxDateConfig } from '../../tokens/config';
import { NgxDatePickerBase } from '../ngx-date-picker-base.component';

@Component({
  selector: 'ngx-date-range-picker',
  standalone: true,
  templateUrl: './ngx-date-range-picker.component.html',
  styleUrls: ['./ngx-date-range-picker.component.scss'],
  imports: [NgTemplateOutlet],
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly direction = inject(DirectionService);

  readonly view = model<DatePickerView>('day');
  /** format of the start/end chips at the top of the picker */
  readonly displayFormat = input<string>('d MMM yyyy');

  @Output() rangeChange = new EventEmitter<NgxDateRange<Date>>();
  @Output() change = new EventEmitter<NgxDateRange<Date>>();

  range: NgxDateRange<Date> = { start: null, end: null };
  hoverDate: Date | null = null;

  weekDays: { min: string; name: string }[] = [];
  /** kept for backwards compatibility: "start – end" text */
  readonly calendarHeader = signal('');
  readonly startText = signal('');
  readonly endText = signal('');
  /** which end the next click will set */
  readonly activeEnd = signal<'start' | 'end'>('start');

  prevDisabled = false;
  nextDisabled = false;

  protected _onChange = (_value: NgxDateRange<Date>) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};
  isDisabled = false;

  constructor() {
    super();
    effect(() => {
      const locale = this.locale();
      this.displayFormat();
      // init() reads and writes currYear / currMonth / view: they must not be dependencies,
      // otherwise every month/year change re-ran init() and reset the view.
      untracked(() => {
        this.adapter = this.dateAdapterRegistry.resolve(locale);
        this.init();
      });
    });
  }

  ngOnInit(): void {
    this.init();
  }

  protected override onDateBoundsChange(): void {
    this._validatorOnChange();
    this.renderDatePicker(this.view());
  }

  updateConfig(val: NgxDateConfig) {
    this.config.set({ ...this.config(), ...val });
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

  override renderDatePicker(view: DatePickerView) {
    if (view !== 'day') {
      // month + year lists are shown together
      this.renderMonth();
      view = 'year';
    }
    super.renderDatePicker(view, undefined, [], () => {
      this.applyRangeState();
      this.updateNavState(view);
    });
  }

  updateHeader() {
    const fmt = (d: Date | null) =>
      d ? (this.adapter.formatDate(this.adapter.toLocale(d), this.displayFormat()) ?? '') : '';
    const start = this.range.start;
    const end = this.range.end ?? (start ? this.hoverDate : null);

    const startText = fmt(start);
    const endText = fmt(end);
    this.startText.set(startText);
    this.endText.set(endText);
    this.activeEnd.set(start && !this.range.end ? 'end' : 'start');

    this.calendarHeader.set(
      endText ? `${startText} – ${endText}` : startText || this.labels().selectDateRange,
    );
  }

  private init() {
    this.months = this.adapter.longMonths;
    const shortDays = this.adapter.shortDays;
    const longDays = this.adapter.longDays;
    this.weekDays = shortDays.map((min, i) => ({ min, name: longDays[i] }));

    const anchor = this.range.start || this.range.end || new Date();
    const locale = this.adapter.toLocale(this.clampToBounds(anchor));
    this.currYear.set(locale.year);
    this.currMonth.set(locale.month ?? 0);
    this.resetYearWindow();
    this.renderDatePicker(this.view());
  }

  private clampToBounds(date: Date): Date {
    if (this.minDate && compareDate(date, this.minDate) < 0) return this.minDate;
    if (this.maxDate && compareDate(date, this.maxDate) > 0) return this.maxDate;
    return date;
  }

  private updateNavState(view: DatePickerView) {
    const y = this.currYear();
    const m = this.currMonth();
    const last = (yy: number, mm: number) =>
      this.adapter.getDate({
        locale: this.locale(),
        year: yy,
        month: mm,
        day: this.adapter.lastDateofMonth(yy, mm),
      });
    const first = (yy: number, mm: number) =>
      this.adapter.getDate({ locale: this.locale(), year: yy, month: mm, day: 1 });

    // the arrows only exist in the day view (month/year are chosen from the lists)
    const p = shiftYearMonth(y, m, -1);
    const n = shiftYearMonth(y, m, 1);
    const prevEnd = last(p.year, p.month);
    const nextStart = first(n.year, n.month);
    this.prevDisabled = !!this.minDate && compareDate(prevEnd, this.minDate) < 0;
    this.nextDisabled = !!this.maxDate && compareDate(nextStart, this.maxDate) > 0;
  }

  /** `month` / `year` both open the two side-by-side lists (months | years). */
  changeView(view: DatePickerView) {
    if (view !== 'day') this.resetYearWindow();
    this.view.set(view);
    this.renderDatePicker(view);
    if (view !== 'day') this.scrollListsToCurrent();
  }

  toggleView(view: DatePickerView) {
    this.changeView(this.view() === view ? 'day' : view);
  }

  /** Navigates to today's month. The selection is left untouched. */
  gotoToday() {
    const l = this.adapter.toLocale(this.clampToBounds(new Date()));
    this.currYear.set(l.year);
    this.currMonth.set(l.month ?? 0);
    this.resetYearWindow();
    this.changeView('day');
  }

  next() {
    this.step(1);
  }

  previous() {
    this.step(-1);
  }

  private step(direction: 1 | -1) {
    if ((direction === 1 && this.nextDisabled) || (direction === -1 && this.prevDisabled)) return;
    const n = shiftYearMonth(this.currYear(), this.currMonth(), direction);
    this.currYear.set(n.year);
    this.currMonth.set(n.month);
    this.renderDatePicker('day');
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

  /** Tap a month: centre it (the wheel selects it); tap the centred one to confirm. */
  tapMonth(ev: Event, item: DateViewMonth, index: number) {
    ev.stopPropagation();
    if (!item.active) return;
    if (item.month === this.currMonth()) this.changeView('day');
    else this.centerRow(ev, index);
  }

  tapYear(ev: Event, item: DateViewYear, index: number) {
    ev.stopPropagation();
    if (!item.active) return;
    if (item.year === this.currYear()) this.changeView('day');
    else this.centerRow(ev, index);
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
    this.updateHeader();
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

  tabbableIndex(): number {
    const days = this.viewDays;
    let i = days.findIndex((d) => (d.rangeStart || d.rangeEnd) && d.active);
    if (i < 0) i = days.findIndex((d) => d.isToday && !d.outside && d.active);
    if (i < 0) i = days.findIndex((d) => !d.outside && d.active);
    return i;
  }

  onDayKeydown(ev: KeyboardEvent, index: number) {
    const rtl = this.direction.isRtl();
    let delta = 0;
    switch (ev.key) {
      case 'ArrowRight':
        delta = rtl ? -1 : 1;
        break;
      case 'ArrowLeft':
        delta = rtl ? 1 : -1;
        break;
      case 'ArrowDown':
        delta = 7;
        break;
      case 'ArrowUp':
        delta = -7;
        break;
      case 'Home':
        delta = -(index % 7);
        break;
      case 'End':
        delta = 6 - (index % 7);
        break;
      case 'PageDown':
        this.moveMonth(ev, index);
        return;
      case 'PageUp':
        this.moveMonth(ev, index);
        return;
      default:
        return;
    }
    ev.preventDefault();
    const target = index + delta;
    if (target >= 0 && target < this.viewDays.length) {
      this.focusDay(target);
    } else {
      this.moveMonth(ev, index, delta);
    }
  }

  private moveMonth(ev: KeyboardEvent, index: number, delta?: number) {
    ev.preventDefault();
    const item = this.viewDays[index];
    if (!item?.date) return;
    const date = new Date(item.date);
    if (delta === undefined) date.setMonth(date.getMonth() + (ev.key === 'PageUp' ? -1 : 1));
    else date.setDate(date.getDate() + delta);
    const l = this.adapter.toLocale(date);
    this.currYear.set(l.year);
    this.currMonth.set(l.month ?? 0);
    this.renderDatePicker('day');
    const idx = this.viewDays.findIndex((d) => !d.outside && d.day === l.day);
    afterNextRender(() => this.focusDay(idx < 0 ? 0 : idx), { injector: this.injector });
  }

  private focusDay(index: number) {
    const buttons = this.host.nativeElement.querySelectorAll<HTMLElement>('.days .day');
    buttons[index]?.focus();
  }
}
