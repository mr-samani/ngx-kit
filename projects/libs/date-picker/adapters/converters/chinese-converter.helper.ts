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

export namespace ChineseConverter {
  export interface ChineseDate {
    day: number;
    month: number; // صفر-پایه
    year: number;
    isLeapMonth: boolean;
  }

  const parser = new Intl.DateTimeFormat(CHINESE_LOCALE, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  /** تبدیل ارقام تمام‌عرض/فول‌ویدث به لاتین */
  function toLatinDigits(str: string): string {
    return str.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  }

  /** استخراج تاریخ چینی از یک Date میلادی - با تشخیص ماه کبیسه */
  export function parse(date: Date): ChineseDate {
    const parts = parser.formatToParts(date);

    const dayPart = parts.find((p) => p.type === 'day')!;
    const monthPart = parts.find((p) => p.type === 'month')!;
    const yearPart = parts.find((p) => p.type === 'year' || p.type === ('relatedYear' as any))!;

    const day = parseInt(toLatinDigits(dayPart.value), 10);
    const isLeapMonth = monthPart.value.includes('闰');
    const month = CHINESE_MONTH_MAP[monthPart.value] ?? 0;
    const year = parseInt(toLatinDigits(yearPart.value), 10);

    return { day, month, year, isLeapMonth };
  }

  /**
   * پیدا کردن آخرین «روز اول ماهِ چینیِ غیرکبیسه» که در همان روز
   * seed یا قبل از آن باشد (جستجوی فقط روبه‌عقب، حداکثر 45 روز).
   *
   * نکته‌ی مهم: این جستجو باید فقط روبه‌عقب باشد، نه «نزدیک‌ترین
   * در هر دو جهت». نسخه‌ی قبلی نزدیک‌ترین day1 را در هر دو جهت
   * برمی‌گرداند که باعث می‌شد وقتی الگوریتم می‌خواهد یک قدم به
   * عقب برود (-5 روز)، چون فاصله‌ی جلو هنوز کمتر بود، دوباره به
   * همان ماهِ قبلی برگردد و لوپ هیچ‌وقت واقعاً عقب نرود (لوپ
   * بی‌نهایت/گیر کردن روی یک ماه ثابت).
   */
  function firstOfMonthAtOrBefore(seed: Date): Date {
    for (let i = 0; i <= 65; i++) {
      const test = new Date(seed);
      test.setDate(test.getDate() - i);
      const c = parse(test);
      if (c.day === 1 && !c.isLeapMonth) {
        return test;
      }
    }
    // عملاً نباید به اینجا برسیم
    return seed;
  }

  /**
   * پیدا کردن JS Date معادل «روز اول» یک ماه چینیِ غیرکبیسه‌ی دلخواه.
   *
   * نسخه‌ی قبلی فرض می‌کرد فیلد `year` بازگشتی از Intl برای
   * `zh-CN-u-ca-chinese` همان شماره‌ی سال در دوره‌ی ۶۰ساله است
   * (epoch هوانگ‌دی)، در حالی‌که در عمل همان سال میلادی برمی‌گردد
   * (مثلاً 2026). با فرمول `year - 2697` این عدد منفی و کاملاً
   * نادرست می‌شد (مثلاً ‎-671‎) و جستجوی ±45 روزه همیشه شکست
   * می‌خورد و روی fallback (یک تاریخ کاملاً غلط) می‌افتاد —
   * همان باگی که باعث می‌شد طول ماه فقط چند روز نمایش داده شود.
   *
   * راه‌حل: مثل آداپتر هجری، از «امروز» -که همیشه با Intl به‌درستی
   * قابل‌خواندن است- به‌عنوان لنگر شروع می‌کنیم و ماه‌به‌ماه
   * جلو/عقب می‌رویم.
   *
   * نکته‌ی اضافیِ مخصوص تقویم چینی: بر خلاف هجری، اینجا «ماه
   * کبیسه» هم وجود دارد. وقتی دقیقاً بین دو ماهِ عادیِ متوالی یک
   * ماه کبیسه فاصله افتاده باشد (مثلاً 五月 عادی -> 闰五月 -> 五月
   * بعدی، یعنی واقعاً ماه پنجم بعدی)، فاصله‌ی واقعی حدود 59 روز
   * می‌شود نه ~30 روز، و یک قدمِ ثابتِ `+30` فقط وسطِ همان ماه
   * کبیسه می‌افتد؛ چون جستجوی عقب ماه کبیسه را نادیده می‌گیرد،
   * به همان ماهِ عادیِ قبلی برمی‌گردد و پیشرفتی حاصل نمی‌شود.
   * برای همین، اگر یک قدم هیچ پیشرفتی نداشت (anchor عوض نشد)،
   * قدم را بزرگ‌تر می‌کنیم تا از روی ماه کبیسه‌ی احتمالی بپرد.
   */
  export function firstDayOfMonth(year: number, month: number): Date {
    let anchorDate = firstOfMonthAtOrBefore(new Date());
    let c = parse(anchorDate);

    // سقف ایمنی برای جلوگیری از لوپ بی‌نهایت (≈ 100 سال چینی)
    let guard = 0;
    while ((c.year !== year || c.month !== month) && guard < 1300) {
      const targetIsLater = year > c.year || (year === c.year && month > c.month);

      let newAnchor = anchorDate;
      // طول هر ماه عادی 29 یا 30 روز است؛ اما اگر بینِ این ماه و
      // ماهِ بعد/قبل یک ماه کبیسه فاصله افتاده باشد، باید قدم را
      // بزرگ‌تر کنیم (به اندازه‌ی حداکثر یک ماهِ کبیسه‌ی اضافه).
      for (const step of targetIsLater ? [30, 60, 90] : [-5, -35, -65]) {
        const probe = new Date(anchorDate);
        probe.setDate(probe.getDate() + step);
        newAnchor = firstOfMonthAtOrBefore(probe);
        if (newAnchor.getTime() !== anchorDate.getTime()) {
          break;
        }
      }

      anchorDate = newAnchor;
      c = parse(anchorDate);
      guard++;
    }
    return anchorDate;
  }

  /** تبدیل سال/ماه/روز چینی به Date میلادی */
  export function toGregorian(year: number, month: number, day: number): Date {
    const first = firstDayOfMonth(year, month);
    const result = new Date(first);
    result.setDate(result.getDate() + (day - 1));
    return result;
  }

  /**
   * تعداد واقعیِ روزهای یک ماه چینی (۲۹ یا ۳۰).
   *
   * نکته: بر خلاف نسخه‌ی هجری، اینجا از شماره‌ی روزِ خروجیِ خودِ
   * تقویم چینی (`parse(test).day`) استفاده می‌کنیم نه از
   * `Date.getDate()` میلادی، چون آن مقدار به اشتباه طول ماه را
   * بر اساس تقویم میلادی محاسبه می‌کرد.
   */
  export function daysInMonth(year: number, month: number): number {
    const first = firstDayOfMonth(year, month);

    for (let i = 1; i <= 31; i++) {
      const test = new Date(first);
      test.setDate(test.getDate() + i);
      const c = parse(test);
      if (c.year !== year || c.month !== month || c.isLeapMonth) {
        const last = new Date(test);
        last.setDate(last.getDate() - 1);
        return parse(last).day;
      }
    }
    return 29; // fallback ایمن
  }
}
