import { compareDate, deserialize, isValid } from './date.helper';
import { NgxDateRange } from '../models/range';

export function normalizeDateRange(
  value: NgxDateRange<Date> | readonly [Date | null, Date | null] | null | undefined,
): NgxDateRange<Date> {
  if (Array.isArray(value)) {
    return normalizeDateRange({ start: value[0], end: value[1] });
  }

  const start = deserialize((value as any)?.start);
  const end = deserialize((value as any)?.end);

  if (start && end && compareDate(start, end) > 0) {
    return { start: end, end: start };
  }

  return { start, end };
}

export function isCompleteDateRange(range: NgxDateRange<Date>): boolean {
  return !!range.start && !!range.end && isValid(range.start) && isValid(range.end);
}

export function isDateInRange(date: Date, range: NgxDateRange<Date>): boolean {
  if (!range.start || !range.end) return false;
  return compareDate(date, range.start) >= 0 && compareDate(date, range.end) <= 0;
}

export function isDateInPreviewRange(
  date: Date,
  start: Date | null,
  previewEnd: Date | null,
): boolean {
  if (!start || !previewEnd) return false;

  const from = compareDate(start, previewEnd) <= 0 ? start : previewEnd;
  const to = compareDate(start, previewEnd) <= 0 ? previewEnd : start;

  return compareDate(date, from) >= 0 && compareDate(date, to) <= 0;
}
