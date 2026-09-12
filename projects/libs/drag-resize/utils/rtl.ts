import { ResizeDirection } from '../contracts/IResizableOutput';

/**
 * Logical directions that resolve differently depending on text direction.
 * 'n' and 's' never change - only the horizontal component is direction-aware.
 */
type LogicalDirectionKey = 'start' | 'end' | 'n-start' | 'n-end' | 's-start' | 's-end';

/** Base (LTR) physical direction for every logical direction. */
const LTR_BASE: Record<LogicalDirectionKey, ResizeDirection> = {
  start: 'w',
  end: 'e',
  'n-start': 'nw',
  'n-end': 'ne',
  's-start': 'sw',
  's-end': 'se',
};

/** Mirrors the horizontal component of a physical direction. 'n' / 's' pass through unchanged. */
const MIRROR: Record<ResizeDirection, ResizeDirection> = {
  n: 'n',
  s: 's',
  e: 'w',
  w: 'e',
  ne: 'nw',
  nw: 'ne',
  se: 'sw',
  sw: 'se',
};

function isLogicalDirection(dir: string): dir is LogicalDirectionKey {
  return Object.prototype.hasOwnProperty.call(LTR_BASE, dir);
}

/**
 * True when `element` sits inside a right-to-left context.
 *
 * Reads the *computed* `direction` style instead of `element.dir`, because
 * `direction` is inherited and is almost never set on the resizable element
 * itself - it's usually set on `<html>`, `<body>`, or some ancestor wrapper.
 */
export function isRtl(element: HTMLElement): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.getComputedStyle(element).direction === 'rtl';
}

/**
 * Resolves a logical direction ('start' | 'end' | 'n-start' | 'n-end' | 's-start' | 's-end')
 * to a physical, viewport-space direction ('n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw')
 * based on `rtl`.
 *
 * Physical directions pass through untouched, so it's always safe to call this
 * even when `dir` might already be physical (e.g. resolving a direction that was
 * already resolved once before).
 */
export function resolveLogicalDirection(dir: string, rtl: boolean): ResizeDirection {
  if (!isLogicalDirection(dir)) {
    return dir as ResizeDirection;
  }

  const base = LTR_BASE[dir];

  return rtl ? MIRROR[base] : base;
}
