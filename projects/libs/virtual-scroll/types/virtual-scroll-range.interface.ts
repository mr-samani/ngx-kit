/**
 * A "line" index range that is currently rendered.
 * A "line" is one item for a plain list, or one row/column of N items
 * for an auto-detected wrapping grid. `end` is exclusive.
 */
export interface NgxVirtualScrollRange {
  start: number;
  end: number;
}

export function rangesEqual(a: NgxVirtualScrollRange, b: NgxVirtualScrollRange): boolean {
  return a.start === b.start && a.end === b.end;
}
