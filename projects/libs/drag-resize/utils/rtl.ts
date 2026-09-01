/**
 * Central RTL/LTR helpers shared by every part of the drag/resize/grid engine.
 * Nothing else in the library should call `getComputedStyle(...).direction` directly —
 * route it through here so behaviour stays consistent everywhere.
 */

/** Returns true when the element's computed writing direction is right-to-left. */
export function isRtl(el: Element | null | undefined): boolean {
  if (!el) return false;
  return getComputedStyle(el).direction === 'rtl';
}

/**
 * Resolves a logical direction ('start' / 'end' / 'n-start' / ...) to a physical,
 * viewport-space direction ('w' / 'e' / 'n' / ...) based on the element's direction.
 * Physical directions (n, e, s, w, ne, nw, se, sw) pass through untouched.
 */
export function resolveLogicalDirection(dir: string, rtl: boolean): string {
  const map: Record<string, string> = rtl
    ? { start: 'e', end: 'w', 'n-start': 'ne', 'n-end': 'nw', 's-start': 'se', 's-end': 'sw' }
    : { start: 'w', end: 'e', 'n-start': 'nw', 'n-end': 'ne', 's-start': 'sw', 's-end': 'se' };
  return map[dir] ?? dir;
}

/** Converts a logical inline-axis delta (positive = towards "end") to a physical X delta. */
export function logicalDeltaToPhysicalX(logicalDelta: number, rtl: boolean): number {
  return rtl ? -logicalDelta : logicalDelta;
}
