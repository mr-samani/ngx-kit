import { describe, expect, it } from 'vitest';
import { GregorianAdapter } from '../adapters/locales/gregorian.adapter';
import { JalaliAdapter } from '../adapters/locales/jalali-adapter';
import { HijriAdapter } from '../adapters/locales/hijri-adapter';
import { ChineseAdapter } from '../adapters/locales/chinese.adapter';

describe('calendar week adapters', () => {
  it('starts Gregorian weeks on Sunday', () => {
    expect(new GregorianAdapter().weekStartDay).toBe(0);
  });

  it('starts Jalali weeks on Saturday', () => {
    expect(new JalaliAdapter().weekStartDay).toBe(6);
  });

  it('keeps other locale adapters explicitly configured', () => {
    expect(new HijriAdapter().weekStartDay).toBe(0);
    expect(new ChineseAdapter().weekStartDay).toBe(0);
  });
});

  it('calculates Gregorian week boundaries from any date', () => {
    const adapter = new GregorianAdapter();
    const start = adapter.getStartOfWeek(new Date('2026-08-19T12:00:00'));
    const end = adapter.getEndOfWeek(new Date('2026-08-19T12:00:00'));

    expect(start.getDay()).toBe(0);
    expect(start.getDate()).toBe(16);
    expect(end.getDay()).toBe(6);
    expect(end.getDate()).toBe(22);
  });

  it('calculates Jalali weeks from Saturday to Friday', () => {
    const adapter = new JalaliAdapter();
    const start = adapter.getStartOfWeek(new Date('2026-08-19T12:00:00'));
    const end = adapter.getEndOfWeek(new Date('2026-08-19T12:00:00'));

    expect(start.getDay()).toBe(6);
    expect(end.getDay()).toBe(5);
  });
