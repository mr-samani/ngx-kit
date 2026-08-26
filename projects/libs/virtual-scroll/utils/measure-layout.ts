import { NgxVirtualScrollMeasurement } from '../types/virtual-scroll-measurement.interface';

const TOP_TOLERANCE_PX = 0.5;

/**
 * Pure, framework-agnostic layout probe.
 *
 * Reads the real bounding boxes of a small batch of already-rendered
 * elements and infers, purely from actual layout:
 *  - the scroll axis (vertical vs horizontal)
 *  - how many items share a single line (1 for a plain list, N for a
 *    wrapping grid)
 *  - the real size of one line, INCLUDING margins/border/box-shadow,
 *    because it is derived from the delta between two real sibling
 *    positions in normal document flow rather than from a hardcoded
 *    itemSize input.
 *
 * No orientation/itemSize is ever supplied by the consumer — this is the
 * single source of truth for both.
 */
export function measureLayout(
  probeElements: readonly Element[],
): NgxVirtualScrollMeasurement | null {
  if (probeElements.length === 0) {
    return null;
  }

  const rects = probeElements.map((el) => el.getBoundingClientRect());

  if (rects.length === 1) {
    // Not enough siblings to infer direction yet; assume a vertical list
    // (the overwhelmingly common case) using the element's own height.
    return { axis: 'vertical', crossCount: 1, lineSize: Math.max(rects[0].height, 1) };
  }

  const first = rects[0];

  // Find the first probed item that starts a new line (its top differs
  // meaningfully from the first item's top).
  let wrapIndex = -1;
  for (let i = 1; i < rects.length; i++) {
    if (Math.abs(rects[i].top - first.top) > TOP_TOLERANCE_PX) {
      wrapIndex = i;
      break;
    }
  }

  if (wrapIndex === -1) {
    // Every probed item shares the same line -> a single horizontal line.
    const lineSize = rects[1].left - first.left;
    return { axis: 'horizontal', crossCount: 1, lineSize: Math.max(lineSize, 1) };
  }

  if (wrapIndex === 1) {
    // The very next item is already on a new line -> a plain vertical list.
    const lineSize = rects[1].top - first.top;
    return { axis: 'vertical', crossCount: 1, lineSize: Math.max(lineSize, 1) };
  }

  // Several items share the first line before wrapping -> a wrapping grid.
  const crossCount = wrapIndex;
  const lineSize = rects[wrapIndex].top - first.top;
  return { axis: 'vertical', crossCount, lineSize: Math.max(lineSize, 1) };
}
