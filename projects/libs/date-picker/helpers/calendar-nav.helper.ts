/**
 * Month arithmetic shared by every calendar system. All supported calendars
 * have exactly 12 months per year, so overflow/underflow of a zero-based month
 * index is normalised by carrying into the year.
 */
export function normalizeYearMonth(year: number, month: number): { year: number; month: number } {
  const total = year * 12 + month;
  const y = Math.floor(total / 12);
  return { year: y, month: total - y * 12 };
}

/** Moves a (year, month) pair by `delta` months. */
export function shiftYearMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  return normalizeYearMonth(year, month + delta);
}
