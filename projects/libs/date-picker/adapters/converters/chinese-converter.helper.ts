/**
 * منطق تبدیل تاریخ سنتی چینی (农历) <-> میلادی
 * جدا از آداپتر، تا قابل تست و استفاده‌ی مستقل باشد.
 *
 * ⚠️ محدودیت شناخته‌شده: ماه‌های کبیسه (闰)
 * در تقویم چینی، یک ماه کبیسه همان شماره‌ی ماه عادیِ قبل از خودش را
 * دارد (مثلاً «闰七月» هم month=6 می‌شود، دقیقاً مثل «七月» عادی).
 * چون CalendarDate در این پروژه فیلدی برای isLeapMonth ندارد، این
 * پیاده‌سازی -مثل نسخه‌ی قبلی- در سال‌های کبیسه، ماه کبیسه را به ماه
 * عادیِ هم‌نام نگاشت می‌کند و کاربر نمی‌تواند مستقیماً وارد ماه کبیسه
 * شود. این یک محدودیتِ آگاهانه است، نه باگ سهوی؛ برای رفع کامل باید
 * فیلد isLeapMonth به CalendarDate اضافه و در همه‌جا (toLocale,
 */
import { normalizeYearMonth } from '../../helpers/calendar-nav.helper';

const CHINESE_LOCALE = 'zh-CN-u-ca-chinese';

/**
 * نام ماه چینی -> شماره (صفر-پایه)
 * ماه‌های عادی: 正月(0) .. 腊月(11)
 *
 * نکته‌ی مهمِ این باگ: Intl برای ماه یازدهم رشته‌ی «十一月» را
 * برمی‌گرداند، نه «冬月» (که فقط یک نام جایگزینِ ادبی/سنتی است و
 * توسط Intl.DateTimeFormat تولید نمی‌شود). نسخه‌ی قبلی این نقشه
 * فقط «冬月» را داشت، پس برای هر آذر/دی‌ماهی mismatch رخ می‌داد و
 * شماره‌ی ماه به‌اشتباه با مقدار پیش‌فرض `?? 0` صفر می‌شد. همین
 * باعث می‌شد طول ماه‌های اطراف آن بازه کاملاً غلط محاسبه شود.
 *
 * ماه‌های کبیسه روی همان شماره‌ی ماه عادیِ هم‌نام نگاشت می‌شوند
 * (به توضیح بالای فایل مراجعه کنید).
 */
const CHINESE_MONTH_MAP: Record<string, number> = {
  正月: 0,
  二月: 1,
  三月: 2,
  四月: 3,
  五月: 4,
  六月: 5,
  七月: 6,
  八月: 7,
  九月: 8,
  十月: 9,
  十一月: 10,
  腊月: 11,
  闰正月: 0,
  闰二月: 1,
  闰三月: 2,
  闰四月: 3,
  闰五月: 4,
  闰六月: 5,
  闰七月: 6,
  闰八月: 7,
  闰九月: 8,
  闰十月: 9,
  闰十一月: 10,
  闰腊月: 11,
};

const MEAN_MONTH_DAYS = 29.530588;

/** Local noon keeps day arithmetic safe around DST transitions. */
function atNoon(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}
function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, 12);
}
function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export namespace ChineseConverter {
  export interface ChineseDate {
    day: number;
    month: number; // zero-based
    year: number;
    isLeapMonth: boolean;
  }

  // Created lazily so that merely importing the library never touches Intl.
  let parser: Intl.DateTimeFormat | null = null;
  function getParser(): Intl.DateTimeFormat {
    return (parser ??= new Intl.DateTimeFormat(CHINESE_LOCALE, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }));
  }

  /** full-width digits -> latin */
  function toLatinDigits(str: string): string {
    return str.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  }

  /** Reads the Chinese lunisolar date (leap month aware) of a Gregorian `Date`. */
  export function parse(date: Date): ChineseDate {
    const parts = getParser().formatToParts(date);

    const dayPart = parts.find((p) => p.type === 'day');
    const monthPart = parts.find((p) => p.type === 'month');
    const yearPart = parts.find((p) => p.type === 'year' || p.type === ('relatedYear' as any));

    const day = parseInt(toLatinDigits(dayPart?.value ?? '1'), 10);
    const monthText = monthPart?.value ?? '';
    const isLeapMonth = monthText.includes('闰') || monthText.includes('閏');
    const month = CHINESE_MONTH_MAP[monthText.replace('閏', '闰')] ?? 0;
    const year = parseInt(toLatinDigits(yearPart?.value ?? '0'), 10);

    return { day, month, year, isLeapMonth };
  }

  /**
   * Latest "first day of a non-leap Chinese month" at or before `seed`
   * (backward-only search, at most 65 days).
   */
  function firstOfMonthAtOrBefore(seed: Date): Date {
    for (let i = 0; i <= 65; i++) {
      const test = addDays(seed, -i);
      const c = parse(test);
      if (c.day === 1 && !c.isLeapMonth) return test;
    }
    return seed;
  }

  // The result only depends on (year, month) so it is cached (see HijriConverter).
  const firstDayOfMonthCache = new Map<string, Date>();

  /**
   * Gregorian `Date` (local midnight) of the first day of a (non-leap) Chinese
   * month. Starts from today and jumps by the mean month length; when a leap
   * month swallows the probe (no progress) the probe is pushed further on.
   * `month` may overflow/underflow and is carried into the year.
   */
  export function firstDayOfMonth(year: number, month: number): Date {
    ({ year, month } = normalizeYearMonth(year, month));
    const cacheKey = `${year}-${month}`;
    const cached = firstDayOfMonthCache.get(cacheKey);
    if (cached) return new Date(cached);

    let anchor = firstOfMonthAtOrBefore(atNoon(new Date()));
    let c = parse(anchor);

    let guard = 0;
    let stuck = 0;
    while ((c.year !== year || c.month !== month) && guard < 300) {
      const diff = (year - c.year) * 12 + (month - c.month);
      const direction = diff >= 0 ? 1 : -1;
      const probe = addDays(
        anchor,
        Math.round(diff * MEAN_MONTH_DAYS) + 14 + stuck * 30 * direction,
      );
      const next = firstOfMonthAtOrBefore(probe);
      stuck = next.getTime() === anchor.getTime() ? stuck + 1 : 0;
      anchor = next;
      c = parse(anchor);
      guard++;
    }

    const result = atMidnight(anchor);
    firstDayOfMonthCache.set(cacheKey, result);
    return new Date(result);
  }

  /** Chinese year/month/day -> Gregorian `Date` (local midnight). */
  export function toGregorian(year: number, month: number, day: number): Date {
    const first = firstDayOfMonth(year, month);
    return new Date(first.getFullYear(), first.getMonth(), first.getDate() + (day - 1));
  }

  const daysInMonthCache = new Map<string, number>();

  /** Real number of days of a Chinese month (29 or 30). */
  export function daysInMonth(year: number, month: number): number {
    const n = normalizeYearMonth(year, month);
    const cacheKey = `${n.year}-${n.month}`;
    const cached = daysInMonthCache.get(cacheKey);
    if (cached !== undefined) return cached;

    const first = atNoon(firstDayOfMonth(n.year, n.month));

    for (let i = 1; i <= 31; i++) {
      const test = addDays(first, i);
      const c = parse(test);
      if (c.year !== n.year || c.month !== n.month || c.isLeapMonth) {
        const result = parse(addDays(test, -1)).day;
        daysInMonthCache.set(cacheKey, result);
        return result;
      }
    }
    return 29; // safe fallback
  }
}
