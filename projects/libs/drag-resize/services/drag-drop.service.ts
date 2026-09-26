import { Injectable, signal } from '@angular/core';
import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';
import { DropListGroupRef } from '../drop-list-group-ref';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  readonly drags = signal<readonly DragRef[]>([]);
  readonly dropLists = signal<readonly DropListRef[]>([]);
  readonly activeDrag = signal<DragRef | null>(null);

  /**
   * DOM-position registries, used to find the nearest enclosing list/group by walking real
   * ancestor elements instead of Angular's element-injector tree.
   *
   * This matters for `ngTemplateOutlet`-based recursive trees (a list of items whose own
   * children are rendered by re-invoking the SAME `<ng-template>`, as in a tree/outliner UI):
   * each invocation gets a FRESH embedded view whose injector context is wherever the outlet
   * was written in the template, not wherever its content ends up in the DOM. So `inject(TOKEN,
   * {skipSelf})` from one recursion level can never see a provider from another level — the
   * only fix within Angular's own DI is to manually thread `ngTemplateOutletInjector` through
   * every recursive call, which isn't reasonable to require of every consumer of this library.
   * A plain DOM walk has no such limitation: it only cares where elements actually ended up.
   */
  private readonly listsByEl = new Map<HTMLElement, DropListRef>();
  private readonly groupsByEl = new Map<HTMLElement, DropListGroupRef>();

  registerDragItem(ref: DragRef<any>): void {
    this.drags.update((items) => (items.includes(ref) ? items : [...items, ref]));
  }

  removeDragItem(ref: DragRef<any>): void {
    this.drags.update((items) => items.filter((x) => x !== ref));
    if (this.activeDrag() === ref) this.activeDrag.set(null);
  }

  registerDropList(ref: DropListRef): void {
    this.dropLists.update((items) => (items.includes(ref) ? items : [...items, ref]));
    if (ref.el) this.listsByEl.set(ref.el, ref);
  }

  removeDropList(ref: DropListRef<any>): void {
    this.dropLists.update((items) => items.filter((x) => x !== ref));
    if (ref.el && this.listsByEl.get(ref.el) === ref) this.listsByEl.delete(ref.el);
  }

  registerGroup(el: HTMLElement, ref: DropListGroupRef): void {
    this.groupsByEl.set(el, ref);
  }

  removeGroup(el: HTMLElement): void {
    this.groupsByEl.delete(el);
  }

  /** Nearest registered drop list starting at (and including) `start`, walking up the DOM. */
  findAncestorDropList(start: HTMLElement | null): DropListRef | null {
    for (let n = start; n; n = n.parentElement) {
      const found = this.listsByEl.get(n);
      if (found) return found;
    }
    return null;
  }

  /** Nearest registered drop-list group starting at (and including) `start`, walking up the DOM. */
  findAncestorGroup(start: HTMLElement | null): DropListGroupRef | null {
    for (let n = start; n; n = n.parentElement) {
      const found = this.groupsByEl.get(n);
      if (found) return found;
    }
    return null;
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
