import { Injectable, signal } from '@angular/core';
import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  readonly drags = signal<readonly DragRef[]>([]);
  readonly dropLists = signal<readonly DropListRef[]>([]);
  readonly activeDrag = signal<DragRef | null>(null);

  registerDragItem(ref: DragRef<any>): void {
    this.drags.update((items) => (items.includes(ref) ? items : [...items, ref]));
  }

  removeDragItem(ref: DragRef<any>): void {
    this.drags.update((items) => items.filter((x) => x !== ref));
    if (this.activeDrag() === ref) this.activeDrag.set(null);
  }

  registerDropList(ref: DropListRef): void {
    this.dropLists.update((items) => (items.includes(ref) ? items : [...items, ref]));
  }

  removeDropList(ref: DropListRef<any>): void {
    this.dropLists.update((items) => items.filter((x) => x !== ref));
  }

  begin(ref: DragRef<any>): void {
    this.activeDrag.set(ref);
  }

  end(ref: DragRef<any>): void {
    if (this.activeDrag() === ref) this.activeDrag.set(null);
  }

  cancelActive(): void {
    const ref = this.activeDrag();
    if (!ref) return;
    ref.cancelDrag();
    this.activeDrag.set(null);
  }

  /**
   * Which drop list is under `point`?
   *
   * - Only lists connected to the drag's ORIGIN list qualify (connectivity is not transitive, so
   *   A→B→C never lets an item hop A→C). Without an origin (a free-drag element) nothing
   *   qualifies: free dragging is never captured by a list.
   * - Only the visible (clip-aware) part of a list counts.
   * - A list inside the dragged element itself is never a target.
   * - Nested lists: the innermost qualifying list wins. Among unrelated overlapping lists the
   *   current one is kept (no flicker), otherwise the smallest.
   */
  findDropList(
    point: { x: number; y: number },
    current?: DropListRef | null,
    origin?: DropListRef | null,
    dragEl?: HTMLElement | null,
  ): DropListRef | null {
    const source = origin ?? null;
    if (!source) return null;

    let best: DropListRef | null = null;
    for (const list of this.dropLists()) {
      if (!list.el || !source.isConnectedTo(list)) continue;
      if (dragEl && dragEl !== list.el && dragEl.contains(list.el)) continue;
      if (!list._containsPoint(point.x, point.y)) continue;

      if (!best) best = list;
      else if (best.el.contains(list.el)) best = list; // deeper wins
      else if (list.el.contains(best.el)) continue;
      else if (list === current) best = list;
      else if (best !== current && list._area() < best._area()) best = list;
    }
    return best;
  }
}
