import { describe, expect, it } from 'vitest';
import {
  isCompleteDateRange,
  isDateInPreviewRange,
  isDateInRange,
  normalizeDateRange,
} from '../helpers/date-range.helper';

const d = (value: string) => new Date(`${value}T12:00:00`);

describe('date-range helpers', () => {
  it('normalizes reversed ranges', () => {
    const range = normalizeDateRange({ start: d('2026-08-20'), end: d('2026-08-10') });
    expect(range.start).toEqual(d('2026-08-10'));
    expect(range.end).toEqual(d('2026-08-20'));
  });

  it('supports tuple values', () => {
    const range = normalizeDateRange([d('2026-08-10'), d('2026-08-20')]);
    expect(isCompleteDateRange(range)).toBe(true);
  });

  it('checks inclusive range boundaries', () => {
    const range = normalizeDateRange({ start: d('2026-08-10'), end: d('2026-08-20') });
    expect(isDateInRange(d('2026-08-10'), range)).toBe(true);
    expect(isDateInRange(d('2026-08-15'), range)).toBe(true);
    expect(isDateInRange(d('2026-08-20'), range)).toBe(true);
    expect(isDateInRange(d('2026-08-21'), range)).toBe(false);
  });

  it('creates a hover preview from the selected start', () => {
    expect(
      isDateInPreviewRange(d('2026-08-15'), d('2026-08-10'), d('2026-08-20')),
    ).toBe(true);
  });
});
