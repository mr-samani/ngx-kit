/**
 * منطق تبدیل تاریخ هجری قمری (Umm al-Qura) <-> میلادی
 * جدا از آداپتر، تا قابل تست و استفاده‌ی مستقل باشد.
 */
const HIJRI_LOCALE = 'ar-SA-u-ca-islamic-umalqura';
const ONE_DAY_MS = 86400000;

export namespace HijriConverter {
  export interface HijriDate {
    day: number;
    month: number; // صفر-پایه: محرم = 0
    year: number;
  }

  const parser = new Intl.DateTimeFormat(HIJRI_LOCALE, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  /** تبدیل اعداد عربی/فارسی به لاتین */
  function toLatinDigits(str: string): string {
    return str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
  }

  /** استخراج تاریخ هجری از یک Date میلادی */
  export function parse(date: Date): HijriDate {
    const parts = parser.formatToParts(date);
    return {
      day: parseInt(toLatinDigits(parts.find((p) => p.type === 'day')!.value), 10),
      month: parseInt(toLatinDigits(parts.find((p) => p.type === 'month')!.value), 10) - 1,
      year: parseInt(toLatinDigits(parts.find((p) => p.type === 'year')!.value), 10),
    };
  }

  /**
   * پیدا کردن آخرین «روز اول ماه هجری» که در همان روز seed یا
   * قبل از آن باشد (جستجوی فقط روبه‌عقب، حداکثر 35 روز).
   *
   * نکته‌ی مهم: این جستجو باید فقط روبه‌عقب باشد، نه «نزدیک‌ترین
   * در هر دو جهت». جستجوی دوجهته باعث می‌شد وقتی الگوریتم می‌خواهد
   * یک قدم به عقب برود (-5 روز)، چون فاصله‌ی جلو هنوز کمتر بود،
   * دوباره به همان ماهِ قبلی برگردد و لوپ هیچ‌وقت واقعاً عقب نرود.
   */
  function firstOfMonthAtOrBefore(seed: Date): Date {
    for (let i = 0; i <= 35; i++) {
      const test = new Date(seed);
      test.setDate(test.getDate() - i);
      if (parse(test).day === 1) {
        return test;
      }
    }
    // عملاً نباید به اینجا برسیم
    return seed;
  }

  /**
   * پیدا کردن JS Date معادل «روز اول» یک ماه هجری دلخواه.
   *
   * به‌جای تکیه به یک فرمولِ تخمینیِ سال میلادی (که می‌تواند تا یک
   * سال کامل خطا داشته باشد و جستجوی محدودِ ±35 روزه را شکست بدهد —
   * همان باگی که باعث می‌شد lastDateofMonth عدد ۳۱ به‌جای ۲۹ بدهد)،
   * از «امروز» -که همیشه با Intl به‌درستی قابل‌خواندن است- به‌عنوان
   * لنگر شروع می‌کنیم و ماه‌به‌ماه جلو/عقب می‌رویم. هر قدم (چه
   * `+30` چه `-5`) probe را به داخلِ بدنه‌ی ماهِ هدف می‌برد (نه قبل
   * از آن)، پس جستجوی «آخرین day1 در همان روز یا قبل‌تر» همیشه
   * دقیقاً day1 همان ماه هدف را پیدا می‌کند.
   */
  // نتیجه‌ی firstDayOfMonth فقط تابعی از (year, month) هست و در طول عمر
  // صفحه هیچ‌وقت عوض نمی‌شه، پس کش‌کردنش کاملاً امنه. اهمیتش اینجاست که
  // renderCalendar (در ngx-date-picker-base.component) برای هر سلولِ روزِ
  // نمایش‌داده‌شده در گرید ماه (~۳۰ تا ۴۲ تا) یک‌بار adapter.getDate() صدا
  // می‌زنه، و هرکدوم به toGregorian() → firstDayOfMonth() ختم می‌شه — یعنی
  // بدون کش، این جست‌وجوی نسبتاً سنگین (که خودش می‌تونه تا حدود ۱۲۰۰ بار
  // تکرار داخلی و هر بار تا ۳۵ فراخوانی Intl.DateTimeFormat داشته باشه) به
  // ازای هر بار رندر یک ماه، ده‌ها بار برای همون (year, month) تکرار می‌شد —
  // مخصوصاً وقتی کاربر به سال‌های دور از «امروز» ناوبری می‌کنه، محسوس کند بود.
  const firstDayOfMonthCache = new Map<string, Date>();

  export function firstDayOfMonth(year: number, month: number): Date {
    const cacheKey = `${year}-${month}`;
    const cached = firstDayOfMonthCache.get(cacheKey);
    if (cached) return new Date(cached);

    let anchorDate = firstOfMonthAtOrBefore(new Date());
    let h = parse(anchorDate);

    // سقف ایمنی برای جلوگیری از لوپ بی‌نهایت (≈ 100 سال هجری)
    let guard = 0;
    while ((h.year !== year || h.month !== month) && guard < 1200) {
      const targetIsLater = year > h.year || (year === h.year && month > h.month);
      const probe = new Date(anchorDate);
      // طول هر ماه هجری 29 یا 30 روز است؛ +30 همیشه به داخل ماه
      // بعد می‌رسد و -5 همیشه داخل بدنه‌ی ماه قبل می‌ماند.
      probe.setDate(probe.getDate() + (targetIsLater ? 30 : -5));
      anchorDate = firstOfMonthAtOrBefore(probe);
      h = parse(anchorDate);
      guard++;
    }
    firstDayOfMonthCache.set(cacheKey, anchorDate);
    return anchorDate;
  }

  /** تبدیل سال/ماه/روز هجری به Date میلادی */
  export function toGregorian(year: number, month: number, day: number): Date {
    const first = firstDayOfMonth(year, month);
    const result = new Date(first);
    result.setDate(result.getDate() + (day - 1));
    return result;
  }

  /**
   * تعداد واقعیِ روزهای یک ماه هجری.
   *
   * نکته‌ی مهم (باگ قبلی): نباید از `Date.getDate()` روی «روز قبل از
   * شروع ماه بعد» استفاده کرد، چون آن عدد، شماره‌ی روز در تقویم
   * میلادیِ همان Date است، نه طول ماه هجری.
   * روش درست: فاصله‌ی روزها بین «اول این ماه» و «اول ماه بعد».
   */
  export function daysInMonth(year: number, month: number): number {
    const nextMonth = (month + 1) % 12;
    const nextYear = month === 11 ? year + 1 : year;

    const first = firstDayOfMonth(year, month);
    const nextFirst = firstDayOfMonth(nextYear, nextMonth);

    const diffMs = nextFirst.getTime() - first.getTime();
    return Math.round(diffMs / ONE_DAY_MS);
  }
}
