/**
 * The scroll axis along which content is virtualized.
 * This is never provided by the consumer — it is always derived from the
 * real, rendered layout of the projected content (see `measureLayout`).
 */
export type NgxVirtualScrollAxis = 'vertical' | 'horizontal';

/**
 * Result of measuring the real DOM layout of a small probe batch of items.
 *
 * - `crossCount === 1`  -> a plain list (the common case: vertical stack of
 *   rows, or a horizontal row of columns).
 * - `crossCount > 1`    -> a wrapping grid (e.g. cards laid out with
 *   `display: flex; flex-wrap: wrap`): `crossCount` items share a line
 *   before wrapping to the next one. The grid still scrolls along a single
 *   `axis`, while the cross axis lays out natively (this is how "mixed"
 *   horizontal + vertical layouts are supported without a 2D data model).
 */
export interface NgxVirtualScrollMeasurement {
  axis: NgxVirtualScrollAxis;
  crossCount: number;
  /** Size (px) of one line along `axis`, including margins/border/shadow. */
  lineSize: number;
}

/** Escape hatch for consumers who need full control over layout detection. */
export type NgxVirtualScrollMeasureFn = (probeElements: readonly Element[]) => NgxVirtualScrollMeasurement | null;
