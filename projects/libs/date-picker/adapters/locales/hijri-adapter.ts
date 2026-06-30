import { DatePickerView } from '../../models/view';
import { CalendarDate } from '../calendar-date';
import { IDateAdapter } from '../IAdapter';

/**
 * تقویم هجری قمری - Umm al-Qura (تقویم رسمی عربستان)
 * نیاز به ICU ≥ 56 دارد (تمام مرورگرهای مدرن)
 */
const HIJRI_LOCALE = 'ar-SA-u-ca-islamic-umalqura';

export class HijriAdapter implements IDateAdapter {
  /** یکشنبه = 0 (هم‌خوان با تقویم میلادی برای سادگی) */
  startOfWeek = 0;

  /** کش برای جلوگیری از ساخت مکرر formatter */
  private readonly parser = new Intl.DateTimeFormat(HIJRI_LOCALE, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

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

  today() {
    const h = this.parseHijri(new Date());
    return { locale: 'ar', day: h.day, month: h.month, year: h.year };
  }

  /**
   * تبدیل اعداد عربی/فارسی به لاتین
   * عربی-شمال آفریقایی: ٠١٢٣٤٥٦٧٨٩
   * فارسی: ۰۱۲۳۴۵۶۷۸۹
   * عربی-خاورمیانه: ٠١٢٣٤٥٦٧٨٩ (همان)
   */
  private toLatinDigits(str: string): string {
    return str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
  }

  /** استخراج تاریخ هجری از JS Date */
  private parseHijri(date: Date): { day: number; month: number; year: number } {
    const parts = this.parser.formatToParts(date);
    return {
      day: parseInt(this.toLatinDigits(parts.find((p) => p.type === 'day')!.value), 10),
      month: parseInt(this.toLatinDigits(parts.find((p) => p.type === 'month')!.value), 10) - 1,
      year: parseInt(this.toLatinDigits(parts.find((p) => p.type === 'year')!.value), 10),
    };
  }

  /**
   * تبدیل تاریخ هجری به JS Date
   * با جستجوی خطی در بازه ±35 روزه اطراف تخمین اولیه
   */
  private toGregorian(year: number, month: number, day: number): Date {
    // سال هجری ≈ (سال میلادی - 622) * 365.25 / 354.367
    const approx = new Date(Math.floor(((year - 1) * 354.367) / 365.25) + 622, month, day);
    for (let i = -35; i <= 35; i++) {
      const test = new Date(approx);
      test.setDate(test.getDate() + i);
      const h = this.parseHijri(test);
      if (h.year === year && h.month === month && h.day === day) {
        return test;
      }
    }

    return approx;
  }

  firstDayofMonth(year: number, month: number): number {
    return this.toGregorian(year, month, 1).getDay();
  }

  lastDateofMonth(year: number, month: number): number {
    const nextMonth = (month + 1) % 12;
    const nextYear = month === 11 ? year + 1 : year;
    const firstOfNext = this.toGregorian(nextYear, nextMonth, 1);
    const last = new Date(firstOfNext);
    last.setDate(last.getDate() - 1);
    return last.getDate();
  }

  lastDayofMonth(year: number, month: number): number {
    const lastDate = this.lastDateofMonth(year, month);
    return this.toGregorian(year, month, lastDate).getDay();
  }

  lastDateofLastMonth(year: number, month: number): number {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    return this.lastDateofMonth(prevYear, prevMonth);
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
    const h = this.parseHijri(date);
    return {
      locale: 'ar',
      year: h.year,
      month: h.month,
      day: h.day,
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
      dayOfWeek: date.getDay(),
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

    return new Intl.DateTimeFormat(HIJRI_LOCALE, options).format(jsDate);
  }

  getStartOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const h = this.parseHijri(date);

    switch (t) {
      case 'year':
        return this.toGregorian(h.year, 0, 1);
      case 'month':
        return this.toGregorian(h.year, h.month, 1);
      case 'day':
        return this.toGregorian(h.year, h.month, h.day);
    }
  }

  getLastOf(date: Date | null, t: DatePickerView): Date | null {
    if (!date) return date;
    const h = this.parseHijri(date);

    switch (t) {
      case 'year':
        return this.toGregorian(h.year, 11, this.lastDateofMonth(h.year, 11));
      case 'month':
        return this.toGregorian(h.year, h.month, this.lastDateofMonth(h.year, h.month));
      case 'day':
        return this.toGregorian(h.year, h.month, h.day);
    }
  }
}
