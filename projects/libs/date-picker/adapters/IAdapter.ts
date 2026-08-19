import { DatePickerView } from '../models/view';
import { CalendarDate } from './calendar-date';

export interface IDateAdapter {
  get longMonths(): string[];
  get narrowDays(): string[];
  get shortDays(): string[];
  get longDays(): string[];
  /** Display index used by existing month-grid APIs. */
  startOfWeek: number;
  /** Native JavaScript weekday (0=Sunday ... 6=Saturday) where a week starts. */
  weekStartDay: number;
  /** Returns the real Gregorian Date at the start/end of the locale week. */
  getStartOfWeek(date: Date): Date;
  getEndOfWeek(date: Date): Date;

  /** convert js date to locale */
  toLocale(date: Date): CalendarDate;

  /** get today of localy */
  today(): CalendarDate;

  /**
   *  getting first day of month
   *
   * شماره  اولین روز از ماه
   * * مثلا 0 یعنی شنبه
   */
  firstDayofMonth(year: number, month: number): number;
  /**
   * getting last date of month
   *
   * این ماه چند روز است
   * * آخرین روز ماه جندم می شود؟
   */
  lastDateofMonth(year: number, month: number): number;

  /**
   * getting last day of month
   *
   * شماره  آخرین روز از ماه
   * * مثلا 0 یعنی شنبه
   */
  lastDayofMonth(year: number, month: number): number;

  /**
   * getting last date of previous month
   *
   * آخرین روز از ماه گذشته
   * * ماه قبل چند روز بوده است؟
   */
  lastDateofLastMonth(year: number, month: number): number;

  getDate(date: CalendarDate): Date;

  formatDate(date: CalendarDate, format: string): string | null;

  getStartOf(date: Date | null, t: DatePickerView): Date | null;
  getLastOf(date: Date | null, t: DatePickerView): Date | null;
}
