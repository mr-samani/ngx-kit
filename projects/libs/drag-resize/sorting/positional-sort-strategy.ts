/**
 * Positional Sort Strategy — Webflow-style smart sorting
 *
 * Core idea:
 *   - Take a snapshot of every item's DOMRect at drag-start.
 *   - On each pointer-move, find which item the pointer is hovering over.
 *   - Decide whether to insert BEFORE or AFTER that item by checking which
 *     "half" the pointer is in:
 *       • Items on the SAME row (same top ±threshold) → use left/right midpoint
 *       • Items on DIFFERENT rows → use top/bottom midpoint
 *   - Move the placeholder in the DOM (no transform).
 *   - Animate siblings with CSS translate3d transforms (same as Angular Material).
 *   - Fully RTL-aware.
 */

import { DragRef } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';
import { SortResult } from './sort-strategy';

/** Pixel tolerance for deciding two items are "on the same row". */
const SAME_ROW_THRESHOLD = 8;

/** How far (px) from list edge auto-triggers "insert at end/start". */
const EDGE_PROXIMITY = 4;

export interface ItemSnapshot {
  drag: DragRef;
  /** Rect at the moment sorting started (before any transforms) */
  rect: MutableRect;
  /** CSS transform that was on the element before drag started */
  initialTransform: string;
  /**
   * Accumulated pixel shift applied as a CSS transform.
   * Positive → shifted down (vertical) or right (horizontal).
   */
  offset: number;
}

/** Plain mutable rectangle — avoids the read-only DOMRect constraint. */
export interface MutableRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

function toMutable(r: DOMRect): MutableRect {
  return {
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    left: r.left,
    width: r.width,
    height: r.height,
  };
}

function shiftRect(r: MutableRect, dx: number, dy: number): void {
  r.top += dy;
  r.bottom += dy;
  r.left += dx;
  r.right += dx;
}

function combineTransforms(a: string, b: string): string {
  if (!b || b === 'none') return a;
  if (!a || a === 'none') return b;
  return `${a} ${b}`;
}

/** Returns true when the pointer is inside `rect`. */
function pointerInRect(rect: MutableRect, x: number, y: number): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/**
 * Are two items on the same visual row?
 * We compare the vertical centres — if they're within SAME_ROW_THRESHOLD px
 * they are considered siblings on the same line.
 */
function onSameRow(a: MutableRect, b: MutableRect): boolean {
  const aCenterY = (a.top + a.bottom) / 2;
  const bCenterY = (b.top + b.bottom) / 2;
  return Math.abs(aCenterY - bCenterY) <= SAME_ROW_THRESHOLD;
}

export class PositionalSortStrategy {
  private _container!: HTMLElement;
  private _isRtl = false;

  /**
   * Current ordered list of items (includes the placeholder's logical slot).
   * Index here = visual order = what we emit as currentIndex.
   */
  private _items: ItemSnapshot[] = [];

  /** The DragRef that is being dragged */
  private _draggingItem: DragRef | null = null;

  /**
   * Index of the placeholder in _items at the last sort call.
   * We use this to avoid redundant DOM moves.
   */
  private _currentPlaceholderIndex = -1;

  withElementContainer(container: HTMLElement): void {
    this._container = container;
  }

  withRtl(rtl: boolean): void {
    this._isRtl = rtl;
  }

  // ─── Session lifecycle ──────────────────────────────────────────────────────

  start(items: readonly DragRef[]): void {
    this._draggingItem = null;
    this._currentPlaceholderIndex = -1;
    this._buildSnapshot(items);
  }

  /**
   * Called when the drag item enters this container.
   * Inserts the placeholder at the best position based on pointer.
   */
  enter(dragItem: DragRef, pointerX: number, pointerY: number): void {
    this._draggingItem = dragItem;

    const ph = dragItem.getPlaceholderElement();

    // Ensure the placeholder is in the container initially
    if (!this._container.contains(ph)) {
      this._container.appendChild(ph);
    }

    // Find and move to correct insert position
    const targetIndex = this._findInsertIndex(pointerX, pointerY, dragItem);
    this._movePlaceholderToIndex(dragItem, targetIndex);
    this._currentPlaceholderIndex = targetIndex;
  }

  /**
   * Core sort call — fires on every pointer-move.
   * Returns new currentIndex of the placeholder, or null if nothing changed.
   */
  sort(dragItem: DragRef, pointerX: number, pointerY: number, _delta: IPosition): SortResult | null {
    const newIndex = this._findInsertIndex(pointerX, pointerY, dragItem);

    if (newIndex === this._currentPlaceholderIndex) {
      return null;
    }

    const previousIndex = this._currentPlaceholderIndex;
    this._movePlaceholderToIndex(dragItem, newIndex);
    this._applyTransforms(previousIndex, newIndex, dragItem);
    this._currentPlaceholderIndex = newIndex;

    return { previousIndex, currentIndex: newIndex };
  }

  reset(): void {
    // Clear all transforms from siblings
    for (const snap of this._items) {
      if (snap.drag !== this._draggingItem) {
        const el = snap.drag.el;
        if (el) {
          el.style.transform = snap.initialTransform || '';
          el.style.transition = '';
        }
      }
    }
    this._items = [];
    this._draggingItem = null;
    this._currentPlaceholderIndex = -1;
  }

  getItemIndex(item: DragRef): number {
    return this._items.findIndex(s => s.drag === item);
  }

  getCurrentIndex(): number {
    return this._currentPlaceholderIndex;
  }

  // ─── Core algorithm ─────────────────────────────────────────────────────────

  /**
   * Given the current pointer position, return the index (0-based, among siblings)
   * at which the placeholder should be inserted.
   *
   * Logic (Webflow-style):
   *   1. Find which sibling item the pointer is over.
   *   2. Is that sibling on the same visual row as the placeholder / dragged item?
   *      YES → decide by left/right midpoint (respect RTL)
   *      NO  → decide by top/bottom midpoint
   *   3. Insert before or after the hovered item accordingly.
   */
  private _findInsertIndex(pointerX: number, pointerY: number, dragItem: DragRef): number {
    const siblings = this._items.filter(s => s.drag !== dragItem);

    if (siblings.length === 0) return 0;

    // Find which sibling the pointer is hovering over
    const hovered = siblings.find(s => pointerInRect(s.rect, pointerX, pointerY));

    if (!hovered) {
      // Pointer is outside all siblings — determine edge insertion
      return this._edgeInsertIndex(pointerX, pointerY, siblings);
    }

    const hoveredIndex = this._items.indexOf(hovered);
    const insertBefore = this._shouldInsertBefore(hovered, pointerX, pointerY, dragItem);

    return insertBefore ? hoveredIndex : hoveredIndex + 1;
  }

  /**
   * Decide whether to insert BEFORE the hovered item.
   *
   * Same-row check: if hovered item's vertical centre is within SAME_ROW_THRESHOLD
   * of the pointer's Y, they're on the same line → use horizontal midpoint.
   * Otherwise use vertical midpoint (above/below).
   */
  private _shouldInsertBefore(hovered: ItemSnapshot, pointerX: number, pointerY: number, dragItem: DragRef): boolean {
    const r = hovered.rect;
    const centerY = (r.top + r.bottom) / 2;
    const centerX = (r.left + r.right) / 2;

    // Determine if the pointer is on the same row as the hovered item
    // We use the hovered item's own rect to judge — not the placeholder
    const pointerOnSameRow = Math.abs(pointerY - centerY) <= r.height / 2 + SAME_ROW_THRESHOLD;

    if (pointerOnSameRow && this._isHorizontalNeighbour(r, dragItem)) {
      // Horizontal decision
      if (this._isRtl) {
        return pointerX > centerX;
      }
      return pointerX < centerX;
    }

    // Vertical decision
    return pointerY < centerY;
  }

  /**
   * Are the hovered item and the drag item on the same visual row?
   * We compare their rects.
   */
  private _isHorizontalNeighbour(hoveredRect: MutableRect, dragItem: DragRef): boolean {
    // If we have a snapshot for the drag item use its original rect,
    // otherwise fall back to its current domRect
    const dragSnap = this._items.find(s => s.drag === dragItem);
    const dragRect = dragSnap?.rect ?? toMutable(dragItem.domRect);
    return onSameRow(hoveredRect, dragRect);
  }

  /**
   * When the pointer is outside all items, insert at the nearest edge.
   */
  private _edgeInsertIndex(pointerX: number, pointerY: number, siblings: ItemSnapshot[]): number {
    if (siblings.length === 0) return 0;

    // Find nearest item by distance from pointer to rect centre
    let nearest = siblings[0];
    let nearestDist = Infinity;

    for (const s of siblings) {
      const cx = (s.rect.left + s.rect.right) / 2;
      const cy = (s.rect.top + s.rect.bottom) / 2;
      const dist = Math.hypot(pointerX - cx, pointerY - cy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = s;
      }
    }

    const nearestIndex = this._items.indexOf(nearest);
    const r = nearest.rect;
    const centerX = (r.left + r.right) / 2;
    const centerY = (r.top + r.bottom) / 2;

    // Same row? → horizontal decision
    if (Math.abs(pointerY - centerY) <= r.height / 2 + SAME_ROW_THRESHOLD) {
      const insertBefore = this._isRtl ? pointerX > centerX : pointerX < centerX;
      return insertBefore ? nearestIndex : nearestIndex + 1;
    }

    // Different row → vertical decision
    return pointerY < centerY ? nearestIndex : nearestIndex + 1;
  }

  // ─── DOM manipulation ────────────────────────────────────────────────────────

  /**
   * Move the placeholder element in the DOM so that it occupies slot `targetIndex`
   * among the REAL (non-placeholder) siblings.
   */
  private _movePlaceholderToIndex(dragItem: DragRef, targetIndex: number): void {
    const ph = dragItem.getPlaceholderElement();
    const realSiblings = this._items.filter(s => s.drag !== dragItem).map(s => s.drag.el);

    // Clamp
    const idx = Math.max(0, Math.min(targetIndex, realSiblings.length));

    if (idx >= realSiblings.length) {
      // Append at end
      this._container.appendChild(ph);
    } else {
      const refEl = realSiblings[idx];
      if (ph.nextSibling !== refEl) {
        this._container.insertBefore(ph, refEl);
      }
    }
  }

  // ─── Transform animation ─────────────────────────────────────────────────────

  /**
   * Apply CSS transforms to siblings to animate them making room for the placeholder.
   *
   * Algorithm:
   *   - Items between previousIndex and newIndex need to shift by ±placeholderSize
   *   - Direction and axis depend on whether items are on the same row or different rows
   */
  private _applyTransforms(previousIndex: number, newIndex: number, dragItem: DragRef): void {
    const ph = dragItem.getPlaceholderElement();
    const phRect = toMutable(ph.getBoundingClientRect());

    const phWidth = phRect.width || dragItem.domRect.width;
    const phHeight = phRect.height || dragItem.domRect.height;

    const direction = newIndex > previousIndex ? 1 : -1;
    const start = Math.min(previousIndex, newIndex);
    const end = Math.max(previousIndex, newIndex);

    for (let i = 0; i < this._items.length; i++) {
      const snap = this._items[i];
      if (snap.drag === dragItem) continue;

      // Only items in the affected range shift
      if (i < start || i >= end) {
        // Keep current offset but don't change direction
        continue;
      }

      const r = snap.rect;

      // Decide axis: same row as the neighbour items → horizontal, else vertical
      const adjacentSnap = this._items[i + direction] ?? this._items[i - direction];
      const horizontal = adjacentSnap ? onSameRow(r, adjacentSnap.rect) : Math.abs(r.width) > Math.abs(r.height); // fallback

      if (horizontal) {
        // Shift left or right to make room
        const shift = this._isRtl ? phWidth * -direction : phWidth * direction;
        snap.offset = shift;
        snap.drag.el.style.transition = 'transform 200ms cubic-bezier(0, 0, 0.2, 1)';
        snap.drag.el.style.transform = combineTransforms(
          `translate3d(${Math.round(shift)}px, 0, 0)`,
          snap.initialTransform
        );
        shiftRect(r, shift, 0);
      } else {
        // Shift up or down
        const shift = phHeight * direction;
        snap.offset = shift;
        snap.drag.el.style.transition = 'transform 200ms cubic-bezier(0, 0, 0.2, 1)';
        snap.drag.el.style.transform = combineTransforms(
          `translate3d(0, ${Math.round(shift)}px, 0)`,
          snap.initialTransform
        );
        shiftRect(r, 0, shift);
      }
    }
  }

  // ─── Snapshot ────────────────────────────────────────────────────────────────

  private _buildSnapshot(items: readonly DragRef[]): void {
    this._items = items.map(drag => ({
      drag,
      rect: toMutable(drag.el.getBoundingClientRect()),
      initialTransform: drag.el.style.transform || '',
      offset: 0,
    }));
  }
}
