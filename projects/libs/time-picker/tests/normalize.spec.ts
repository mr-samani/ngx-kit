import { describe, expect, it } from 'vitest';
import { normalizeTime } from '../utils/normalize';

describe('normalizeTime', () => {
  it('should zero-pad a single-digit hour when the minute is already 2 digits', () => {
    expect(normalizeTime('9:05')).toBe('09:05');
  });

  it('should keep a valid HH:MM value as-is', () => {
    expect(normalizeTime('09:05')).toBe('09:05');
    expect(normalizeTime('23:59')).toBe('23:59');
    expect(normalizeTime('00:00')).toBe('00:00');
  });

  it('should reject a single-digit minute, even with a valid hour (strict 2-digit minute)', () => {
    expect(normalizeTime('09:5')).toBeNull();
  });

  it('should reject an out-of-range hour (>23)', () => {
    expect(normalizeTime('24:00')).toBeNull();
  });

  it('should reject an out-of-range minute (>59)', () => {
    expect(normalizeTime('12:60')).toBeNull();
  });

  it('should reject non-time strings', () => {
    expect(normalizeTime('abc')).toBeNull();
    expect(normalizeTime('')).toBeNull();
    expect(normalizeTime('1:2:3')).toBeNull();
    expect(normalizeTime('-1:30')).toBeNull();
  });
});
