/**
 * Pure geometry used by the drop-list sorting engine.
 *
 * Nothing in this file touches the DOM. Everything is a deterministic function of
 * `(rectangles, pointer)`, which is what makes sorting reversible: the same pointer over the
 * same snapshot always yields the same insertion index, regardless of what the previous
 * pointer positions were.
 *
 * Layout direction is *derived from the rectangles* (row clustering + the order in which DOM
 * siblings actually appear on screen) rather than from `flex-direction` / `direction`. That is
 * what lets one algorithm handle block flow, inline flow, flex (row/column/wrap/reverse),
 * grid, RTL and `order:`-reshuffled layouts. Computed style is only a fallback for lists that
 * are too small (0 or 1 item) to reveal their own orientation.
 */

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Point {
  x: number;
  y: number;
}

/** `x` = one row, `y` = one column, `grid` = several rows containing several items. */
export type Axis = 'x' | 'y' | 'grid';
export type Sign = 1 | -1;

export interface LayoutModel {
  axis: Axis;
  /** +1: DOM order advances left→right inside a row. -1: right→left (RTL, row-reverse...). */
  dirX: Sign;
  /** +1: rows/items advance top→bottom in DOM order. -1: bottom→top (column-reverse, wrap-reverse). */
  dirY: Sign;
  /** Row index (in DOM order) of every box. */
  rowOf: number[];
  /** Horizontal direction of every row (a single row can differ from the global one). */
  rowDirX: Sign[];
  /** Mid-lines separating consecutive rows, in DOM row order. Length = rowCount - 1. */
  rowBounds: number[];
  /** Outer edges of the first / last row along the row direction (see `dirY`). */
  yStart: number;
  yEnd: number;
  rowCount: number;
}

/**
 * Hysteresis is the only "magic" number in the algorithm and it is deliberate: without it a
 * pointer resting exactly on a sibling's mid-line flips the placeholder on every sub-pixel
 * jitter (and on every rounding difference between two layouts). It is proportional to the
 * sibling's size and capped, so it can never make a small item feel sticky.
 */
export const HYSTERESIS_RATIO = 0.1;
export const HYSTERESIS_MAX_PX = 6;

export function hysteresis(size: number): number {
  return Math.min(HYSTERESIS_MAX_PX, Math.max(0, size) * HYSTERESIS_RATIO);
}

const cx = (b: Box) => (b.left + b.right) / 2;
const cy = (b: Box) => (b.top + b.bottom) / 2;
const width = (b: Box) => b.right - b.left;
const height = (b: Box) => b.bottom - b.top;
const sign = (n: number): Sign => (n < 0 ? -1 : 1);

interface RowAcc {
  top: number;
  bottom: number;
  first: number;
  last: number;
  count: number;
}

/**
 * Builds a layout model from DOM-ordered boxes.
 *
 * @param fallbackAxis orientation to assume when there are fewer than two boxes.
 * @param fallbackRtl inline direction to assume when no row contains two items.
 */
export function analyzeLayout(
  boxes: readonly Box[],
  fallbackAxis: 'x' | 'y' = 'y',
  fallbackRtl = false,
): LayoutModel {
  const rows: RowAcc[] = [];
  const rowOf: number[] = [];

  boxes.forEach((b, i) => {
    const row = rows[rows.length - 1];
    if (row) {
      const overlap = Math.min(b.bottom, row.bottom) - Math.max(b.top, row.top);
      const smaller = Math.min(height(b), row.bottom - row.top);
      // Same row when the boxes share at least half of the smaller one's height. Touching or
      // sub-pixel-overlapping boxes (fractional heights) therefore start a new row.
      if (overlap > 0 && overlap >= smaller * 0.5) {
        row.top = Math.min(row.top, b.top);
        row.bottom = Math.max(row.bottom, b.bottom);
        row.last = i;
        row.count++;
        rowOf.push(rows.length - 1);
        return;
      }
    }
    rows.push({ top: b.top, bottom: b.bottom, first: i, last: i, count: 1 });
    rowOf.push(rows.length - 1);
  });

  const rowCount = rows.length;

  // Vertical direction: which way do successive rows travel?
  const dirY: Sign =
    rowCount > 1
      ? sign((rows[rowCount - 1].top + rows[rowCount - 1].bottom) / 2 - (rows[0].top + rows[0].bottom) / 2)
      : 1;

  // Horizontal direction per row (from the first/last item of that row) + a global vote.
  const rowDirX: Sign[] = [];
  let votes = 0;
  for (const r of rows) {
    if (r.count > 1) {
      const d = sign(cx(boxes[r.last]) - cx(boxes[r.first]));
      rowDirX.push(d);
      votes += d;
    } else {
      rowDirX.push(0 as unknown as Sign); // resolved below once the global vote is known
    }
  }
  const dirX: Sign = votes !== 0 ? sign(votes) : fallbackRtl ? -1 : 1;
  for (let i = 0; i < rowDirX.length; i++) if (!rowDirX[i]) rowDirX[i] = dirX;

  const rowBounds: number[] = [];
  for (let r = 0; r < rowCount - 1; r++) {
    rowBounds.push(dirY === 1 ? (rows[r].bottom + rows[r + 1].top) / 2 : (rows[r].top + rows[r + 1].bottom) / 2);
  }

  const first = rows[0];
  const lastRow = rows[rowCount - 1];
  const yStart = first ? (dirY === 1 ? first.top : first.bottom) : 0;
  const yEnd = lastRow ? (dirY === 1 ? lastRow.bottom : lastRow.top) : 0;

  let axis: Axis;
  if (boxes.length < 2) axis = fallbackAxis;
  else if (rowCount === 1) axis = 'x';
  else if (rows.every((r) => r.count === 1)) axis = 'y';
  else axis = 'grid';

  return { axis, dirX, dirY, rowOf, rowDirX, rowBounds, yStart, yEnd, rowCount };
}

function rowAt(model: LayoutModel, y: number): number {
  let r = 0;
  for (const bound of model.rowBounds) {
    if (model.dirY === 1 ? y > bound : y < bound) r++;
    else break;
  }
  return r;
}

/**
 * Where should the dragged item be inserted, given the pointer?
 *
 * The result is the number of *other* items that end up before the dragged one, i.e. the
 * dragged item's final index. `slot` is the index (in `boxes`) of the dragged item's own slot
 * (its placeholder), or -1 when the list does not contain one yet.
 *
 * `current` is the index the slot currently has in "others space"; it only decides on which
 * side of a sibling's mid-line the small hysteresis band applies. Pass `null` for a first
 * placement (no history, no hysteresis).
 *
 * Pure: depends only on its arguments.
 */
export function resolveInsertionIndex(
  model: LayoutModel,
  boxes: readonly Box[],
  slot: number,
  pointer: Point,
  current: number | null,
): number {
  let before = 0;
  let others = 0;

  for (let i = 0; i < boxes.length; i++) {
    if (i === slot) continue;
    const o = others++;
    const b = boxes[i];
    // Sign of the hysteresis band: +1 favours "stays before the pointer", -1 favours "stays after".
    const bias = current === null ? 0 : o < current ? 1 : -1;

    let isBefore: boolean;
    if (model.axis === 'x') {
      isBefore = model.dirX * (pointer.x - cx(b)) + bias * hysteresis(width(b)) > 0;
    } else if (model.axis === 'y') {
      isBefore = model.dirY * (pointer.y - cy(b)) + bias * hysteresis(height(b)) > 0;
    } else {
      const row = model.rowOf[i];
      const py = pointer.y + model.dirY * bias * hysteresis(height(b));
      const pointerRow = rowAt(model, py);
      if (model.dirY * (py - model.yStart) < 0) {
        isBefore = false; // above the first row: nothing precedes the pointer
      } else if (model.dirY * (py - model.yEnd) > 0) {
        isBefore = true; // below the last row: everything does (append)
      } else if (pointerRow !== row) {
        isBefore = pointerRow > row;
      } else {
        isBefore = model.rowDirX[row] * (pointer.x - cx(b)) + bias * hysteresis(width(b)) > 0;
      }
    }
    if (isBefore) before++;
  }
  return before;
}

/**
 * Along-axis displacement of every box when the slot moves to `target` (others-space index).
 *
 * The result is where each box has to be translated so that the boxes, re-ordered, occupy the
 * same run of space they occupied before, using each box's own size and the *measured* gaps
 * between the original slots (so `gap`, margins and inline whitespace are handled by
 * construction, not by assumption). Only meaningful for `x` / `y` axes; `grid` returns zeros.
 */
export function computeAxisOffsets(model: LayoutModel, boxes: readonly Box[], slot: number, target: number): number[] {
  const n = boxes.length;
  const offsets = new Array<number>(n).fill(0);
  if (model.axis === 'grid' || n < 2 || slot < 0) return offsets;

  const horizontal = model.axis === 'x';
  const dir = horizontal ? model.dirX : model.dirY;

  // Mirror into a frame where DOM order is ascending, so one code path serves LTR and RTL.
  const lo = boxes.map((b) => (horizontal ? (dir === 1 ? b.left : -b.right) : dir === 1 ? b.top : -b.bottom));
  const hi = boxes.map((b) => (horizontal ? (dir === 1 ? b.right : -b.left) : dir === 1 ? b.bottom : -b.top));

  const order: number[] = [];
  for (let i = 0; i < n; i++) if (i !== slot) order.push(i);
  order.splice(Math.max(0, Math.min(target, n - 1)), 0, slot);

  let cursor = lo[0];
  for (let p = 0; p < n; p++) {
    const item = order[p];
    const delta = cursor - lo[item];
    offsets[item] = Math.abs(delta) < 1e-6 ? 0 : dir * delta;
    cursor += hi[item] - lo[item] + (p < n - 1 ? lo[p + 1] - hi[p] : 0);
  }
  return offsets;
}

/** Intersection of two boxes, or `null` when they do not overlap. */
export function intersectBoxes(a: Box, b: Box): Box | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return right > left && bottom > top ? { left, top, right, bottom } : null;
}

export function boxContains(b: Box, x: number, y: number): boolean {
  return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
}

export function toBox(r: { left: number; top: number; right: number; bottom: number }): Box {
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
}
