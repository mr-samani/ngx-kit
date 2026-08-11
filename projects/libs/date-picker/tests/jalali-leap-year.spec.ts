import { describe, expect, it } from 'vitest';
import { JalaliAdapter } from '../adapters/locales/jalali-adapter';
import { Jalali } from '../adapters/converters/jalali-converter.helper';

/**
 * قبلاً lastDateofMonth/lastDateofLastMonth از یه فرمولِ ساده‌ی «هر ۴ سال
 * یک‌بار» برای کبیسه‌بودنِ اسفند استفاده می‌کردن، که با قانونِ واقعیِ
 * نجومیِ ۳۳ ساله در تقریباً ۴۰٪ سال‌ها اختلاف داشت (تأیید‌شده با تست
 * تجربی، ۸۳ از ۲۰۰ سال). این تست‌ها چندتا سالِ مشخص رو (که واقعاً باهم
 * اختلاف داشتن) چک می‌کنن تا مطمئن بشیم دیگه از تابعِ درستِ
 * Jalali.isLeapJalaaliYear استفاده می‌شه.
 */
describe('JalaliAdapter — کبیسه‌ی اسفند', () => {
  const adapter = new JalaliAdapter();
  const ESFAND = 11; // ماهِ ۰-ایندکس (دی=9، بهمن=10، اسفند=11)

  it('باید با تابعِ درستِ isLeapJalaaliYear هم‌خونی داشته باشه، نه فرمولِ ساده‌ی ۴ساله', () => {
    // چندتا سال که فرمولِ قدیمیِ (year-1095)%4 !=0 ?29:30 باهاشون اشتباه بود
    const sampleYears = [1300, 1303, 1307, 1309, 1311, 1313];

    for (const year of sampleYears) {
      const expected = Jalali.isLeapJalaaliYear(year) ? 30 : 29;
      expect(adapter.lastDateofMonth(year, ESFAND)).toBe(expected);
    }
  });

  it('سالِ ۱۴۰۳ (کبیسه‌ی شناخته‌شده) باید ۳۰ روزه باشه', () => {
    expect(Jalali.isLeapJalaaliYear(1403)).toBe(true);
    expect(adapter.lastDateofMonth(1403, ESFAND)).toBe(30);
  });

  it('سالِ ۱۴۰۴ (غیرکبیسه) باید ۲۹ روزه باشه', () => {
    expect(Jalali.isLeapJalaaliYear(1404)).toBe(false);
    expect(adapter.lastDateofMonth(1404, ESFAND)).toBe(29);
  });

  it('ماه‌های اول تا ششم باید همیشه ۳۱ روز باشن', () => {
    for (let m = 0; m <= 5; m++) {
      expect(adapter.lastDateofMonth(1403, m)).toBe(31);
    }
  });

  it('ماه‌های هفتم تا یازدهم باید همیشه ۳۰ روز باشن', () => {
    for (let m = 6; m <= 10; m++) {
      expect(adapter.lastDateofMonth(1403, m)).toBe(30);
    }
  });

  it('lastDateofLastMonth باید همون منطق رو برای ماهِ قبل اعمال کنه', () => {
    // ماهِ قبل از فروردینِ ۱۴۰۴ (month=0) یعنی اسفندِ ۱۴۰۳ (کبیسه = ۳۰ روز)
    expect(adapter.lastDateofLastMonth(1404, 0)).toBe(30);
  });
});
