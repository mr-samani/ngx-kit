import { normalizeYearMonth } from '../../helpers/calendar-nav.helper';

const HIJRI_LOCALE = 'ar-SA-u-ca-islamic-umalqura';
const MEAN_MONTH_DAYS = 29.530588;
const ONE_DAY_MS = 86400000;

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

export namespace HijriConverter {
  export interface HijriDate {
    day: number;
    month: number; // zero-based: Muharram = 0
    year: number;
  }

  // Created lazily so that merely importing the library never touches Intl
  // (SSR runtimes / workers with a stripped ICU would otherwise crash at import).
  let parser: Intl.DateTimeFormat | null = null;
  function getParser(): Intl.DateTimeFormat {
    return (parser ??= new Intl.DateTimeFormat(HIJRI_LOCALE, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }));
  }

  /** Arabic-Indic / Persian digits -> latin */
  function toLatinDigits(str: string): string {
    return str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
  }

  /** Reads the Hijri date of a Gregorian `Date`. */
  export function parse(date: Date): HijriDate {
    const parts = getParser().formatToParts(date);
    const num = (type: string) =>
      parseInt(toLatinDigits(parts.find((p) => p.type === type)?.value ?? '0'), 10);
    return { day: num('day'), month: num('month') - 1, year: num('year') };
  }

  /**
   * Finds the latest "first day of a Hijri month" at or before `seed`
   * (backward-only search, at most 35 days).
   */
  function firstOfMonthAtOrBefore(seed: Date): Date {
    for (let i = 0; i <= 35; i++) {
      const test = addDays(seed, -i);
      if (parse(test).day === 1) return test;
    }
    return seed;
  }

  // The result only depends on (year, month), so it is safe to cache. Rendering
  // one month calls getDate() for every visible cell, which would otherwise
  // repeat this relatively expensive search dozens of times.
  const firstDayOfMonthCache = new Map<string, Date>();

  /**
   * Gregorian `Date` (local midnight) of the first day of a Hijri month.
   * Starting from today (always readable through Intl) the search jumps by the
   * mean month length and corrects itself, so far-away years need only a few
   * iterations. `month` may overflow/underflow and is carried into the year.
   */
  export function firstDayOfMonth(year: number, month: number): Date {
    ({ year, month } = normalizeYearMonth(year, month));
    const cacheKey = `${year}-${month}`;
    const cached = firstDayOfMonthCache.get(cacheKey);
    if (cached) return new Date(cached);

    let anchor = firstOfMonthAtOrBefore(atNoon(new Date()));
    let h = parse(anchor);

    let guard = 0;
    while ((h.year !== year || h.month !== month) && guard < 200) {
      const diff = (year - h.year) * 12 + (month - h.month);
      // aim for the middle of the target month, then search backwards for day 1
      const probe = addDays(anchor, Math.round(diff * MEAN_MONTH_DAYS) + 14);
      anchor = firstOfMonthAtOrBefore(probe);
      h = parse(anchor);
      guard++;
    }

    const result = atMidnight(anchor);
    firstDayOfMonthCache.set(cacheKey, result);
    return new Date(result);
  }

  /** Hijri year/month/day -> Gregorian `Date` (local midnight). */
  export function toGregorian(year: number, month: number, day: number): Date {
    const first = firstDayOfMonth(year, month);
    return new Date(first.getFullYear(), first.getMonth(), first.getDate() + (day - 1));
  }

  /** Real number of days in a Hijri month (29 or 30). */
  export function daysInMonth(year: number, month: number): number {
    const n = normalizeYearMonth(year, month);
    const next = normalizeYearMonth(n.year, n.month + 1);

    const first = firstDayOfMonth(n.year, n.month);
    const nextFirst = firstDayOfMonth(next.year, next.month);
    return Math.round((nextFirst.getTime() - first.getTime()) / ONE_DAY_MS);
  }
}
