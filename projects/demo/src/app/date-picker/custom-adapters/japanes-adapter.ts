import { CalendarDate, IDateAdapter } from 'ngx-kit/date-picker';
import { DatePickerView } from 'ngx-kit/date-picker/models/view';

export class JapanesAdapter implements IDateAdapter {
  get longMonths(): string[] {
    throw new Error('Method not implemented.');
  }
  get narrowDays(): string[] {
    throw new Error('Method not implemented.');
  }
  get shortDays(): string[] {
    throw new Error('Method not implemented.');
  }
  get longDays(): string[] {
    throw new Error('Method not implemented.');
  }
  startOfWeek: number = 0;
  toLocale(date: Date): CalendarDate {
    throw new Error('Method not implemented.');
  }
  today(): CalendarDate {
    throw new Error('Method not implemented.');
  }
  firstDayofMonth(year: number, month: number): number {
    throw new Error('Method not implemented.');
  }
  lastDateofMonth(year: number, month: number): number {
    throw new Error('Method not implemented.');
  }
  lastDayofMonth(year: number, month: number): number {
    throw new Error('Method not implemented.');
  }
  lastDateofLastMonth(year: number, month: number): number {
    throw new Error('Method not implemented.');
  }
  getDate(date: CalendarDate): Date {
    throw new Error('Method not implemented.');
  }
  getOutputDate(date: Date): CalendarDate {
    throw new Error('Method not implemented.');
  }
  formatDate(date: CalendarDate, format: string): string | null {
    throw new Error('Method not implemented.');
  }
  getStartOf(date: Date | null, t: DatePickerView): Date | null {
    throw new Error('Method not implemented.');
  }
  getLastOf(date: Date | null, t: DatePickerView): Date | null {
    throw new Error('Method not implemented.');
  }
}
