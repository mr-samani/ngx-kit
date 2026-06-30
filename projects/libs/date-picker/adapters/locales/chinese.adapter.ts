import { DatePickerView } from '../../models/view';
import { CalendarDate } from '../calendar-date';
import { IDateAdapter } from '../IAdapter';

/**
 * تقویم سنتی چینی (农历)
 * نکته: شماره سال برگشتی از Intl می‌تواند سال مطلق (مثل 4721)
 * یا شماره در دوره 60 ساله باشد، بسته به نسخه ICU.
 */
const CHINESE_LOCALE = 'zh-CN-u-ca-chinese';
/**
 * تبدیل نام ماه چینی به شماره
 * ماه‌های عادی: 正月(1), 二月(2), ..., 腊月(12)
 * ماه کبیسه: 闰正月(1), 闰二月(2), ...
 */
const CHINESE_MONTH_MAP: Record<string, number> = {
  正月: 1,
  二月: 2,
  三月: 3,
  四月: 4,
  五月: 5,
  六月: 6,
  七月: 7,
  八月: 8,
  九月: 9,
  十月: 10,
  冬月: 11, // ماه یازدهم
  腊月: 12, // ماه دوازدهم
  闰正月: 1,
  闰二月: 2,
  闰三月: 3,
  闰四月: 4,
  闰五月: 5,
  闰六月: 6,
  闰七月: 7,
  闰八月: 8,
  闰九月: 9,
  闰十月: 10,
  闰冬月: 11,
  闰腊月: 12,
};
export class ChineseAdapter implements IDateAdapter {
  /** یکشنبه = 0 */
  startOfWeek = 0;

  private readonly parser = new Intl.DateTimeFormat(CHINESE_LOCALE, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

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
    const c = this.parseChinese(date);
    return { locale: 'zh', day: c.day, month: c.month, year: c.year, date: new Date() };
  }
  today() {
    return this.toLocale(new Date());
  }

  /** استخراج تاریخ چینی از JS Date - با تشخیص ماه کبیسه */
  private parseChinese(date: Date): {
    day: number;
    month: number;
    year: number;
    isLeapMonth: boolean;
  } {
    const parts = this.parser.formatToParts(date);

    const dayPart = parts.find((p) => p.type === 'day')!;
    const monthPart = parts.find((p) => p.type === 'month')!;
    const yearPart = parts.find((p) => p.type === 'year' || p.type === ('relatedYear' as any))!;

    // تبدیل اعداد به لاتین (برای اطمینان)
    const toLatin = (str: string) =>
      str.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));

    const day = parseInt(toLatin(dayPart.value), 10);
    const isLeap = monthPart.value.includes('闰');
    const monthNum = CHINESE_MONTH_MAP[monthPart.value] ?? 0;
    const year = parseInt(toLatin(yearPart.value), 10);

    return { day, month: monthNum - 1, year, isLeapMonth: isLeap };
  }

  /** پیدا کردن JS Date معادل روز اول ماه چینی (غیر کبیسه) */
  private firstDayOfChineseMonth(year: number, month: number): Date {
    // تخمین اولیه: epoch هوانگ‌دی ≈ 2697 قبل از میلاد
    const gregorianGuess = year > 2000 ? year - 2697 : year;
    const guess = new Date(gregorianGuess, month, 1);

    for (let i = -45; i <= 45; i++) {
      const test = new Date(guess);
      test.setDate(test.getDate() + i);
      const c = this.parseChinese(test);
      if (c.year === year && c.month === month && c.day === 1 && !c.isLeapMonth) {
        return test;
      }
    }

    return guess;
  }

  /** تبدیل تاریخ چینی به JS Date */
  private toGregorian(year: number, month: number, day: number): Date {
    const firstDay = this.firstDayOfChineseMonth(year, month);
    const result = new Date(firstDay);
    result.setDate(result.getDate() + day - 1);
    return result;
  }

  firstDayofMonth(year: number, month: number): number {
    return this.firstDayOfChineseMonth(year, month).getDay();
  }

  lastDateofMonth(year: number, month: number): number {
    const firstDay = this.firstDayOfChineseMonth(year, month);

    // جلو برو تا برسی به ماه بعد
    for (let i = 1; i <= 60; i++) {
      const test = new Date(firstDay);
      test.setDate(test.getDate() + i);
      const c = this.parseChinese(test);
      if (c.year !== year || c.month !== month || c.isLeapMonth) {
        test.setDate(test.getDate() - 1);
        return this.parseChinese(test).day;
      }
    }

    return 30; // fallback
  }

  lastDayofMonth(year: number, month: number): number {
    const firstDay = this.firstDayOfChineseMonth(year, month);
    const lastDay = this.lastDateofMonth(year, month);
    const last = new Date(firstDay);
    last.setDate(last.getDate() + lastDay - 1);
    return last.getDay();
  }

  /**
   * روز آخر ماه قبل - با یک ترفند ساده:
   * روز قبل از روز اول ماه فعلی، حتماً آخرین روز ماه قبل است
   * (چه ماه عادی چه کبیسه)
   */
  lastDateofLastMonth(year: number, month: number): number {
    const firstOfThis = this.firstDayOfChineseMonth(year, month);
    const lastOfPrev = new Date(firstOfThis);
    lastOfPrev.setDate(lastOfPrev.getDate() - 1);
    return this.parseChinese(lastOfPrev).day;
  }

  getDate(date: CalendarDate): Date {
    const jsDate = this.toGregorian(date.year, date.month ?? 1, date.day ?? 1);
    if (date.hours !== undefined) jsDate.setHours(date.hours);
    if (date.minutes !== undefined) jsDate.setMinutes(date.minutes);
    if (date.seconds !== undefined) jsDate.setSeconds(date.seconds);
    if (date.milliseconds !== undefined) jsDate.setMilliseconds(date.milliseconds);
    return jsDate;
  }

  getOutputDate(date: Date): CalendarDate {
    const c = this.parseChinese(date);
    return {
      locale: 'zh',
      year: c.year,
      month: c.month,
      day: c.day,
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
      dayOfWeek: date.getDay(),
      date: date,
    };
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

    return new Intl.DateTimeFormat(CHINESE_LOCALE, options).format(jsDate);
  }

  getStartOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const c = this.parseChinese(date);

    switch (t) {
      case 'year':
        return this.firstDayOfChineseMonth(c.year, 0);
      case 'month':
        return this.firstDayOfChineseMonth(c.year, c.month);
      case 'day':
        return this.toGregorian(c.year, c.month, c.day);
    }
  }

  getLastOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const c = this.parseChinese(date);

    switch (t) {
      case 'year':
        return this.toGregorian(c.year, 11, this.lastDateofMonth(c.year, 11));
      case 'month':
        return this.toGregorian(c.year, c.month, this.lastDateofMonth(c.year, c.month));
      case 'day':
        return this.toGregorian(c.year, c.month, c.day);
    }
  }
}
