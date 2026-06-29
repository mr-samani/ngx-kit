/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

export function deserialize(value: any): Date | null {
  if (typeof value === 'string') {
    if (!value) {
      return null;
    }
    // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
    // string is the right format first.
    if (ISO_8601_REGEX.test(value)) {
      let date = new Date(value);
      if (isValid(date)) {
        return date;
      }
    }
  }
  if (isValid(value)) {
    return value;
  } else {
    return null;
  }
}

export function isValid(obj: any) {
  return obj instanceof Date && !isNaN(obj.getTime());
}

/**
 * Checks if two dates are equal.
 * @param first The first date to check.
 * @param second The second date to check.
 * @returns Whether the two dates are equal.
 *     Null dates are considered equal to other null dates.
 */
export function sameDate(first: Date | null, second: Date | null): boolean {
  if (first && second) {
    let firstValid = isValid(first);
    let secondValid = isValid(second);
    if (firstValid && secondValid) {
      return !compareDate(first, second);
    }
    return firstValid == secondValid;
  }
  return first == second;
}

/**
 * Compares two dates.
 * @param first The first date to compare.
 * @param second The second date to compare.
 * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
 *     a number greater than 0 if the first date is later.
 */
export function compareDate(first?: Date | null, second?: Date | null): number {
  if (!first || !second) return 0;
  return (
    first.getFullYear() - second.getFullYear() ||
    first.getMonth() - second.getMonth() ||
    first.getDate() - second.getDate()
  );
}

/**
 * Clamp the given date between min and max dates.
 * @param date The date to clamp.
 * @param min The minimum value to allow. If null or omitted no min is enforced.
 * @param max The maximum value to allow. If null or omitted no max is enforced.
 * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
 *     otherwise `date`.
 */
export function clampDate(date?: Date | null, min?: Date | null, max?: Date | null): number {
  if (min && compareDate(date, min) < 0) {
    return -1;
  }
  if (max && compareDate(date, max) > 0) {
    return 1;
  }
  return 0;
}

//------------------------------------------------------------------------------------------------------------
/**
 * check only year and month
 */
export function compareMonth(first: Date, second: Date): number {
  return first.getFullYear() - second.getFullYear() || first.getMonth() - second.getMonth();
}
export function clampMonth(date: Date, min?: Date | null, max?: Date | null): number {
  if (min && compareMonth(date, min) < 0) {
    return -1;
  }
  if (max && compareMonth(date, max) > 0) {
    return 1;
  }
  return 0;
}
//------------------------------------------------------------------------------------------------------------
/**
 * check only year
 */
export function compareYear(first: Date, second: Date): number {
  return first.getFullYear() - second.getFullYear();
}
export function clampYear(date: Date, min?: Date | null, max?: Date | null): number {
  if (min && compareYear(date, min) < 0) {
    return -1;
  }
  if (max && compareYear(date, max) > 0) {
    return 1;
  }
  return 0;
}
