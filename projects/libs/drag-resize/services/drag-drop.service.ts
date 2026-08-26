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
  findDropList(point: { x: number; y: number }, current?: DropListRef | null): DropListRef | null {
    const lists = this.dropLists();
    const inside = lists.filter((list) => {
      const r = list.el?.getBoundingClientRect();
      return (
        !!r && point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom
      );
    });
    if (current && inside.includes(current)) return current;
    return (
      inside.find(
        (list) =>
          !current ||
          current.connectedTo.length === 0 ||
          current.connectedTo.includes(list.el) ||
          list.connectedTo.includes(current.el),
      ) ??
      inside[0] ??
      null
    );
  }
}
