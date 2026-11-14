import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Injector,
  model,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { clampDate, compareDate, deserialize, isValid } from '../../helpers/date.helper';
import { shiftYearMonth } from '../../helpers/calendar-nav.helper';
import { NgxDateConfig } from '../../tokens/config';
import { NgxDatePickerBase, YEARS_PER_PAGE } from '../ngx-date-picker-base.component';
import { DatePickerView } from '../../models/view';
import { CalendarDate } from '../../adapters/calendar-date';
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
import { DirectionService } from 'ngx-kit/core';

@Component({
  selector: 'ngx-date-picker',
  templateUrl: './ngx-datepicker.component.html',
  styleUrls: ['./ngx-datepicker.component.scss'],
  imports: [NgTemplateOutlet],
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly direction = inject(DirectionService);

  readonly view = model<DatePickerView>('day');

  @Output() change = new EventEmitter<Date | null>();

  selected?: CalendarDate;

  /** content of the summary block at the top of the picker */
  readonly summary = signal<{ day: string; weekday: string; monthYear: string } | null>(null);
  /** kept for backwards compatibility: the formatted selected date */
  readonly calendarHeader = signal('');
  isDisabled = false;

  prevDisabled = false;
  nextDisabled = false;
  todayDisabled = false;
  yearRangeLabel = '';

  weekDays: { min: string; name: string }[] = [];
  protected _onChange = (value: Date | null) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};

  constructor() {
    super();
    effect(() => {
      this.adapter = this.dateAdapterRegistry.resolve(this.locale());
      // the selected date is a real Date; re-express it in the new calendar
      if (this.selected?.date) this.selected = this.adapter.toLocale(this.selected.date);
      this.init();
    });
  }

  ngOnInit(): void {
    this.init();
  }

  protected override onDateBoundsChange(): void {
    this._validatorOnChange();
    this.init();
  }

  updateConfig(val: NgxDateConfig) {
    this.config.set({ ...this.config(), ...val });
  }

  init() {
    this.months = this.adapter.longMonths;
    const sDays = this.adapter.shortDays;
    const lDays = this.adapter.longDays;
    this.weekDays = sDays.map((m, i) => ({ min: m, name: lDays[i] }));

    // Show the month of the selected date, otherwise today (clamped into min/max).
    // Today is only a place to look at - it is NOT selected.
    const anchor = this.selected?.date ?? this.clampToBounds(new Date());
    const l = this.adapter.toLocale(anchor);
    this.currYear.set(l.year);
    this.currMonth.set(l.month ?? 0);
    this.alignYearPage();
    this.renderDatePicker(this.view());
  }

  private clampToBounds(date: Date): Date {
    if (this.minDate && compareDate(date, this.minDate) < 0) return this.minDate;
    if (this.maxDate && compareDate(date, this.maxDate) > 0) return this.maxDate;
    return date;
  }

  writeValue(value: any): void {
    const validValue = deserialize(value);
    this.selected = validValue ? this.adapter.toLocale(validValue) : undefined;
    this.init();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.selected?.date) {
      if (!isValid(this.selected.date)) {
        return {
          invalid: true,
        };
      }
      const c = clampDate(this.selected?.date, this.minDate, this.maxDate);
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

  override renderDatePicker(view: DatePickerView) {
    super.renderDatePicker(view, this.selected, [], () => {
      this.updateSummary();
      this.updateNavState(view);
    });
  }

  private updateSummary() {
    const d = this.selected;
    if (!d?.date) {
      this.summary.set(null);
      this.calendarHeader.set('');
      return;
    }
    const weekday = this.adapter.formatDate(d, 'EEEE') ?? '';
    const monthYear = this.adapter.formatDate(d, 'MMMM yyyy') ?? '';
    this.summary.set({ day: String(d.day), weekday, monthYear });
    this.calendarHeader.set(this.adapter.formatDate(d, 'EEEE, d MMMM, yyyy') ?? '');
  }

  /** Disables the arrows when the neighbouring period lies completely outside min/max. */
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

    let prevEnd: Date;
    let nextStart: Date;
    if (view === 'year') {
      prevEnd = last(this.yearPageStart - 1, 11);
      nextStart = first(this.yearPageStart + YEARS_PER_PAGE, 0);
      this.yearRangeLabel = `${this.yearPageStart} – ${this.yearPageStart + YEARS_PER_PAGE - 1}`;
    } else if (view === 'month') {
      prevEnd = last(y - 1, 11);
      nextStart = first(y + 1, 0);
    } else {
      const p = shiftYearMonth(y, m, -1);
      const n = shiftYearMonth(y, m, 1);
      prevEnd = last(p.year, p.month);
      nextStart = first(n.year, n.month);
    }
    this.prevDisabled = !!this.minDate && compareDate(prevEnd, this.minDate) < 0;
    this.nextDisabled = !!this.maxDate && compareDate(nextStart, this.maxDate) > 0;

    const today = new Date();
    this.todayDisabled = clampDate(today, this.minDate, this.maxDate) !== 0;
  }

  /** Navigates to today's month without selecting anything. */
  gotoToday() {
    const l = this.adapter.toLocale(this.clampToBounds(new Date()));
    this.currYear.set(l.year);
    this.currMonth.set(l.month ?? 0);
    this.alignYearPage();
    this.changeView('day');
  }

  /** The "Today" button: selects today's date. */
  selectToday() {
    if (this.todayDisabled || this.isDisabled) return;
    this.commit(new Date());
  }

  changeView(v: DatePickerView) {
    if (v === 'year') this.alignYearPage();
    this.view.set(v);
    this.renderDatePicker(v);
  }

  /** Opens `v`, or goes back to the day grid when it is already open. */
  toggleView(v: DatePickerView) {
    this.changeView(this.view() === v ? 'day' : v);
  }

  next() {
    this.step(1);
  }

  previous() {
    this.step(-1);
  }

  private step(direction: 1 | -1) {
    if ((direction === 1 && this.nextDisabled) || (direction === -1 && this.prevDisabled)) return;
    const view = this.view();
    if (view === 'year') {
      this.yearPageStart += direction * YEARS_PER_PAGE;
    } else if (view === 'month') {
      this.currYear.update((y) => y + direction);
    } else {
      const n = shiftYearMonth(this.currYear(), this.currMonth(), direction);
      this.currYear.set(n.year);
      this.currMonth.set(n.month);
    }
    this.renderDatePicker(view);
  }

  private commit(date: Date) {
    this.selected = this.adapter.toLocale(date);
    this.renderDatePicker(this.view());
    this.change.emit(date);
  }

  selectDay(ev: Event, item: DateViewDay) {
    ev.stopPropagation();
    if (!item.active || !item.date || this.isDisabled) return;
    this.commit(item.date);
  }

  selectMonth(ev: Event, item: DateViewMonth) {
    ev.stopPropagation();
    if (item.active) {
      this.currMonth.set(item.month);
      this.changeView('day');
    }
  }

  selectYear(ev: Event, item: DateViewYear) {
    ev.stopPropagation();
    if (item.active) {
      this.currYear.set(item.year);
      this.changeView('month');
    }
  }

  clear() {
    this.selected = undefined;
    this.renderDatePicker(this.view());
    this.change.emit(null);
  }
  stopPagination(ev: Event) {
    ev.stopPropagation();
  }

  /** Roving tabindex: exactly one day in the grid is reachable with Tab. */
  tabbableIndex(): number {
    const days = this.viewDays;
    let i = days.findIndex((d) => d.selected && d.active);
    if (i < 0) i = days.findIndex((d) => d.isToday && !d.outside && d.active);
    if (i < 0) i = days.findIndex((d) => !d.outside && d.active);
    return i;
  }

  /** Arrow keys / Page keys / Home / End move between days like a native date grid. */
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
        this.moveMonth(ev, 1, index);
        return;
      case 'PageUp':
        this.moveMonth(ev, -1, index);
        return;
      default:
        return;
    }
    ev.preventDefault();
    const target = index + delta;
    if (target >= 0 && target < this.viewDays.length) {
      this.focusDay(target);
    } else {
      this.moveMonth(ev, target < 0 ? -1 : 1, index, delta);
    }
  }

  private moveMonth(ev: KeyboardEvent, direction: 1 | -1, index: number, delta?: number) {
    ev.preventDefault();
    const item = this.viewDays[index];
    if (!item?.date) return;
    // keep the same day-of-month when paging, or step 1/7 days over the edge
    const date = new Date(item.date);
    if (delta === undefined) date.setMonth(date.getMonth() + direction);
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
