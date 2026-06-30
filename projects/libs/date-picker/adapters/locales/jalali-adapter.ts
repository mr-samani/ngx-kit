import { genFormatDate } from '../../helpers/date-format.helper';
import { Jalali } from '../../helpers/jalali.helper';
import { DatePickerView } from '../../models/view';
import { IDateAdapter } from '../IAdapter';
import { CalendarDate } from '../calendar-date';

export class JalaliAdapter implements IDateAdapter {
  // shanbeh
  startOfWeek = 1;

  dariMonth = false;

  get longMonths() {
    return [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
  }
  get narrowDays() {
    return ['شنبه', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه'];
  }
  get shortDays() {
    return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  }
  get longDays() {
    return ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه'];
  }

  constructor() {}

  today() {
    let jToday = Jalali.toJalaali(new Date());
    return {
      locale: 'fa',
      day: jToday.jd,
      month: jToday.jm - 1,
      year: jToday.jy,
    };
  }
  /**
   *  getting first day of month
   */
  firstDayofMonth(year: number, month: number) {
    let gDate = Jalali.jalaaliToDateObject(year, month + 1, 1);
    let day = gDate.getDay() + this.startOfWeek;
    return day > 6 ? 0 : day;
  }
  /**
   * getting last date of month
   */
  lastDateofMonth(year: number, month: number) {
    const monthLengths = [
      31,
      31,
      31,
      31,
      31,
      31,
      30,
      30,
      30,
      30,
      30,
      (year - 1095) % 4 != 0 ? 29 : 30,
    ];
    return monthLengths[month];
  }
  /**
   * getting last day of month
   */
  lastDayofMonth(year: number, month: number) {
    let gDate = Jalali.jalaaliToDateObject(year, month + 1, this.lastDateofMonth(year, month));
    let day = gDate.getDay() + this.startOfWeek;
    return day > 6 ? 0 : day;
  }
  /**
   * getting last date of previous month
   */
  lastDateofLastMonth(year: number, month: number) {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    const monthLengths = [
      31,
      31,
      31,
      31,
      31,
      31,
      30,
      30,
      30,
      30,
      30,
      (year - 1095) % 4 != 0 ? 29 : 30,
    ];
    return monthLengths[month];
  }
  /**
   * تبدیل تاریخ جلالی به میلادی برای نمایش
   * month start with zero
   * @param date
   * @returns
   */
  getDate(date: CalendarDate): Date {
    let d = Jalali.jalaaliToDateObject(
      date.year,
      date.month ? date.month + 1 : 1,
      date.day ?? 1,
      date.hours ?? 0,
      date.minutes ?? 0,
      date.seconds ?? 0,
      date.milliseconds ?? 0,
    );

    // {
    //       locale: 'fa',
    //       year: d.getFullYear(),
    //       month: d.getMonth(),
    //       day: d.getDate(),
    //       hours: d.getHours(),
    //       minutes: d.getMinutes(),
    //       seconds: d.getSeconds(),
    //       milliseconds: d.getMilliseconds(),
    //       dayOfWeek: d.getDay() + this.startOfWeek,
    //     }
    return d;
  }

  getOutputDate(date: Date): CalendarDate {
    let jDate = Jalali.toJalaali(date);
    return {
      locale: 'fa',
      year: jDate.jy,
      month: jDate.jm - 1,
      day: jDate.jd,
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
      dayOfWeek: date.getDay() + this.startOfWeek,
    };
  }
  formatDate(date: CalendarDate, format: string) {
    if (!date) {
      return '';
    }
    // let option: Intl.DateTimeFormatOptions = {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit'
    // };
    // if (format === 'full') {
    //     option = {
    //         year: 'numeric',
    //         month: 'long',
    //         day: '2-digit',
    //         weekday: 'long'
    //     };
    // }
    // return new Date(date).toLocaleDateString('fa-IR-u-nu-latn', option);
    return genFormatDate(date, format, this.longMonths, this.longDays);
  }
  // _______________________________________________________________________________________

  getStartOf(date: Date | null, t: DatePickerView) {
    if (!date) {
      return date;
    }
    let jDate = Jalali.toJalaali(date);
    switch (t) {
      case 'year':
        return Jalali.jalaaliToDateObject(jDate.jy, 1, 1);
      case 'month':
        // console.log(jDate.jy, '-', jDate.jm, '-', 1);
        return Jalali.jalaaliToDateObject(jDate.jy, jDate.jm, 1);
      case 'day':
        return Jalali.jalaaliToDateObject(jDate.jy, jDate.jm, jDate.jd);
    }
  }

  getLastOf(date: Date | null, t: DatePickerView) {
    if (!date) {
      return date;
    }
    let jDate = Jalali.toJalaali(date);
    switch (t) {
      case 'year':
        return Jalali.jalaaliToDateObject(jDate.jy, 12, 0);
      case 'month':
        // console.log(jDate.jy, '-', jDate.jm, '-', this.lastDateofMonth(jDate.jy, jDate.jm));
        return Jalali.jalaaliToDateObject(
          jDate.jy,
          jDate.jm,
          this.lastDateofMonth(jDate.jy, jDate.jm),
        );
      case 'day':
        return Jalali.jalaaliToDateObject(jDate.jy, jDate.jm, jDate.jd);
    }
  }
}
