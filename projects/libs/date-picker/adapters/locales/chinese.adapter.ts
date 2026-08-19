import { DatePickerView } from '../../models/view';
import { CalendarDate } from '../calendar-date';
import { ChineseConverter } from '../converters/chinese-converter.helper';
import { IDateAdapter } from '../IAdapter';

/**
 * تقویم سنتی چینی (农历)
 * منطق تبدیل تاریخ در ChineseConverter (helpers/chinese-converter.helper.ts) است.
 *
 * ⚠️ محدودیت شناخته‌شده: ماه‌های کبیسه (闰) فعلاً به ماه عادیِ هم‌نام
 * نگاشت می‌شوند؛ جزئیات در chinese-converter.helper.ts.
 */
export class ChineseAdapter implements IDateAdapter {
  /** یکشنبه = 0 */
  startOfWeek = 0;
  weekStartDay = 0;

  get longMonths(): string[] {
    return [
      '正月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '冬月',
      '腊月',
    ];
  }

  get narrowDays(): string[] {
    return ['日', '一', '二', '三', '四', '五', '六'];
  }

  get shortDays(): string[] {
    return ['日', '一', '二', '三', '四', '五', '六'];
  }

  get longDays(): string[] {
    return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  }

  toLocale(date: Date): CalendarDate {
    const c = ChineseConverter.parse(date);
    return {
      locale: 'zh',
      day: c.day,
      month: c.month,
      year: c.year,
      date,
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
      dayOfWeek: date.getDay(),
    };
  }

  today() {
    return this.toLocale(new Date());
  }

  firstDayofMonth(year: number, month: number): number {
    return ChineseConverter.firstDayOfMonth(year, month).getDay();
  }

  lastDateofMonth(year: number, month: number): number {
    return ChineseConverter.daysInMonth(year, month);
  }

  lastDayofMonth(year: number, month: number): number {
    const lastDate = this.lastDateofMonth(year, month);
    return ChineseConverter.toGregorian(year, month, lastDate).getDay();
  }

  /**
   * روز آخر ماه قبل - با یک ترفند ساده:
   * روز قبل از روز اول ماه فعلی، حتماً آخرین روز ماه قبل است.
   */
  lastDateofLastMonth(year: number, month: number): number {
    const firstOfThis = ChineseConverter.firstDayOfMonth(year, month);
    const lastOfPrev = new Date(firstOfThis);
    lastOfPrev.setDate(lastOfPrev.getDate() - 1);
    return ChineseConverter.parse(lastOfPrev).day;
  }

  /** month start with zero */
  getDate(date: CalendarDate): Date {
    const jsDate = ChineseConverter.toGregorian(date.year, date.month ?? 0, date.day ?? 1);
    if (date.hours !== undefined) jsDate.setHours(date.hours);
    if (date.minutes !== undefined) jsDate.setMinutes(date.minutes);
    if (date.seconds !== undefined) jsDate.setSeconds(date.seconds);
    if (date.milliseconds !== undefined) jsDate.setMilliseconds(date.milliseconds);
    return jsDate;
  }

  formatDate(date: CalendarDate, format: string): string | null {
    if (!date) return null;

    const jsDate = this.getDate(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (format === 'full') {
      options.weekday = 'long';
    }

    return new Intl.DateTimeFormat('zh-CN-u-ca-chinese', options).format(jsDate);
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const delta = (d.getDay() - this.weekStartDay + 7) % 7;
    d.setDate(d.getDate() - delta);
    return d;
  }

  getEndOfWeek(date: Date): Date {
    const d = this.getStartOfWeek(date);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  getStartOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const c = ChineseConverter.parse(date);

    switch (t) {
      case 'year':
        return ChineseConverter.firstDayOfMonth(c.year, 0);
      case 'month':
        return ChineseConverter.firstDayOfMonth(c.year, c.month);
      case 'day':
        return ChineseConverter.toGregorian(c.year, c.month, c.day);
    }
  }

  getLastOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const c = ChineseConverter.parse(date);

    switch (t) {
      case 'year':
        return ChineseConverter.toGregorian(c.year, 11, ChineseConverter.daysInMonth(c.year, 11));
      case 'month':
        return ChineseConverter.toGregorian(
          c.year,
          c.month,
          ChineseConverter.daysInMonth(c.year, c.month),
        );
      case 'day':
        return ChineseConverter.toGregorian(c.year, c.month, c.day);
    }
  }
}
