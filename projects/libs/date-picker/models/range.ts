/**
 * A date range used by ngx-kit date range picker.
 *
 * `end` is null while the user is selecting the second date.
 */
export interface NgxDateRange<T = Date> {
  start: T | null;
  end: T | null;
}

export function createDateRange<T = Date>(
  start: T | null = null,
  end: T | null = null,
): NgxDateRange<T> {
  return { start, end };
}
