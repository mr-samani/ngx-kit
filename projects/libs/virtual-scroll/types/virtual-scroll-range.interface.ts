/**
 * بازه‌ی ایندکس‌هایی که در حال حاضر باید در DOM رندر شوند.
 * end اکسکلوسیو است (مثل Array.slice).
 */
export interface NgxVirtualScrollRange {
  start: number;
  end: number;
}

export function rangesEqual(a: NgxVirtualScrollRange, b: NgxVirtualScrollRange): boolean {
  return a.start === b.start && a.end === b.end;
}
