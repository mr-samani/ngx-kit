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

  findDropList(
    point: { x: number; y: number },
    current?: DropListRef | null,
  ): DropListRef | null {
    const candidates = this.dropLists()
      .filter((list) => {
        const r = list.el?.getBoundingClientRect();
        return (
          !!r &&
          point.x >= r.left &&
          point.x <= r.right &&
          point.y >= r.top &&
          point.y <= r.bottom
        );
      });

    // Staying over the current list should always win.
    if (current && candidates.includes(current)) return current;

    // Never jump into an unrelated list just because it overlaps the pointer.
    // Prefer the smallest matching connected container (useful for nested lists).
    return candidates
      .filter((list) => !current || current.isConnectedTo(list))
      .sort((a, b) => {
        const ra = a.el.getBoundingClientRect();
        const rb = b.el.getBoundingClientRect();
        return ra.width * ra.height - rb.width * rb.height;
      })[0] ?? null;
  }
}
