import { describe, expect, it } from 'vitest';
import { normalizeYearMonth, shiftYearMonth } from '../helpers/calendar-nav.helper';
import { JalaliAdapter } from '../adapters/locales/jalali-adapter';
import { HijriAdapter } from '../adapters/locales/hijri-adapter';

describe('calendar month navigation', () => {
  it('carries month overflow/underflow into the year', () => {
    expect(normalizeYearMonth(1405, 12)).toEqual({ year: 1406, month: 0 });
    expect(normalizeYearMonth(1405, -1)).toEqual({ year: 1404, month: 11 });
    expect(shiftYearMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
  });

  it('Jalali getDate returns a local-midnight date for overflowing months', () => {
    const a = new JalaliAdapter();
    const d = a.getDate({ locale: 'fa', year: 1405, month: 12, day: 1 });
    const e = a.getDate({ locale: 'fa', year: 1406, month: 0, day: 1 });
    expect(d.getTime()).toBe(e.getTime());
    expect(d.getHours()).toBe(0);
  });

  it('Jalali round-trips without a one-day shift', () => {
    const a = new JalaliAdapter();
    const src = new Date(2026, 10, 14);
    const l = a.toLocale(src);
    expect(a.getDate(l).getDate()).toBe(14);
  });

  it('Hijri month lengths are 29 or 30', () => {
    const a = new HijriAdapter();
    for (let m = 0; m < 12; m++) expect([29, 30]).toContain(a.lastDateofMonth(1448, m));
  });
});
