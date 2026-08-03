// Date and Time Patterns

import { CalendarDate } from '../adapters/calendar-date';

// yy = 2-digit year; yyyy = full year

// M = digit month; MM = 2-digit month; MMM = short month name; MMMM = full month name

// EEEE = full weekday name; EEE = short weekday name

// d = digit day; dd = 2-digit day

// h = hours am/pm; hh = 2-digit hours am/pm; H = hours; HH = 2-digit hours

// m = minutes; mm = 2-digit minutes; aaa = AM/PM

// s = seconds; ss = 2-digit seconds

// S = miliseconds

export function genFormatDate(
  date: CalendarDate,
  pattern = 'M/d/yyyy',
  monthNames: string[],
  dayNames: string[],
): string {
  if (!date) {
    return '';
  }

  const day = date.day ?? 0;
  const month = date.month ?? 0;
  const year = date.year ?? 0;
  const hour24 = date.hours ?? 0;
  const minute = date.minutes ?? 0;
  const second = date.seconds ?? 0;
  const ms = date.milliseconds ?? 0;
  const dayOfWeek = date.dayOfWeek ?? 0;

  const hour12 = hour24 % 12 || 12;

  const tokens: Record<string, string> = {
    yyyy: year.toString(),

    yy: year.toString().slice(-2),

    MMMM: monthNames[month] ?? '',

    MMM: (monthNames[month] ?? '').substring(0, 3),

    MM: twoDigitPad(month + 1),

    M: (month + 1).toString(),

    EEEE: dayNames[dayOfWeek] ?? '',

    EEE: (dayNames[dayOfWeek] ?? '').substring(0, 3),

    dd: twoDigitPad(day),

    d: day.toString(),

    HH: twoDigitPad(hour24),

    H: hour24.toString(),

    hh: twoDigitPad(hour12),

    h: hour12.toString(),

    mm: twoDigitPad(minute),

    m: minute.toString(),

    ss: twoDigitPad(second),

    s: second.toString(),

    S: ms.toString().padStart(3, '0'),

    aaa: hour24 < 12 ? 'AM' : 'PM',
  };

  return pattern.replace(
    /yyyy|yy|MMMM|MMM|MM|M|EEEE|EEE|dd|d|HH|H|hh|h|mm|m|ss|s|S|aaa/g,
    (token) => tokens[token],
  );
}

export function twoDigitPad(num: number): string {
  return num.toString().padStart(2, '0');
}

// console.log(formatDate(new Date())); // 12/19/2022
// console.log(formatDate(new Date(), 'dd-MMM-yyyy')); //OP's request 19-Dec-2022
// console.log(formatDate(new Date(), 'EEEE, MMMM d, yyyy HH:mm:ss.S aaa')); //  Monday, December 19, 2022 10:44:35.437 AM
// console.log(formatDate(new Date(), 'EEE, MMM d, yyyy HH:mm')); //Mon, Dec 19, 2022 10:44
// console.log(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss.S')); //2022-12-19 10:44:35.438
// console.log(formatDate(new Date(), 'M/dd/yyyy h:mmaaa')); //12/19/2022 10:44AM
