import { DatePickerView } from '../../models/view';
import { CalendarDate } from '../calendar-date';
import { HijriConverter } from '../converters/hijri-converter.helper';
import { IDateAdapter } from '../IAdapter';

/**
 * تقویم هجری قمری - Umm al-Qura (تقویم رسمی عربستان)
 * نیاز به ICU ≥ 56 دارد (تمام مرورگرهای مدرن)
 *
 * منطق تبدیل تاریخ در HijriConverter (helpers/hijri-converter.helper.ts) است.
 */
export class HijriAdapter implements IDateAdapter {
  /** یکشنبه = 0 (هم‌خوان با تقویم میلادی برای سادگی) */
  startOfWeek = 0;

  get longMonths(): string[] {
    return [
      'محرم',
      'صفر',
      'ربيع الأول',
      'ربيع الثاني',
      'جمادى الأولى',
      'جمادى الثانية',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ];
  }

  get narrowDays(): string[] {
    return ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
  }

  get shortDays(): string[] {
    return ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  }

  get longDays(): string[] {
    return ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  }

  toLocale(date: Date): CalendarDate {
    const h = HijriConverter.parse(date);
    return {
      locale: 'ar',
      day: h.day,
      month: h.month,
      year: h.year,
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
    return HijriConverter.firstDayOfMonth(year, month).getDay();
  }

  lastDateofMonth(year: number, month: number): number {
    return HijriConverter.daysInMonth(year, month);
  }

  lastDayofMonth(year: number, month: number): number {
    const lastDate = this.lastDateofMonth(year, month);
    return HijriConverter.toGregorian(year, month, lastDate).getDay();
  }

  lastDateofLastMonth(year: number, month: number): number {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    return this.lastDateofMonth(prevYear, prevMonth);
  }

  /** month start with zero */
  getDate(date: CalendarDate): Date {
    const jsDate = HijriConverter.toGregorian(date.year, date.month ?? 0, date.day ?? 1);
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

    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', options).format(jsDate);
  }

  getStartOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const h = HijriConverter.parse(date);

    switch (t) {
      case 'year':
        return HijriConverter.toGregorian(h.year, 0, 1);
      case 'month':
        return HijriConverter.toGregorian(h.year, h.month, 1);
      case 'day':
        return HijriConverter.toGregorian(h.year, h.month, h.day);
    }
  }

  getLastOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const h = HijriConverter.parse(date);

    switch (t) {
      case 'year':
        return HijriConverter.toGregorian(h.year, 11, HijriConverter.daysInMonth(h.year, 11));
      case 'month':
        return HijriConverter.toGregorian(
          h.year,
          h.month,
          HijriConverter.daysInMonth(h.year, h.month),
        );
      case 'day':
        return HijriConverter.toGregorian(h.year, h.month, h.day);
    }
  }
}
