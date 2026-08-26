import { EventEmitter, inject } from '@angular/core';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { DragRef } from './drag-ref';
import { PositionalSortStrategy } from './sorting/positional-sort-strategy';
import { PlaceHolderRef } from './placeholder-ref';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: unknown;
  readonly _draggables = new Set<DragRef<T>>();
  readonly onDrop = new EventEmitter<IDropEvent<T>>();
  private strategy = new PositionalSortStrategy();
  private active = false;
  private previousIndex = -1;
  private placeholder?: PlaceHolderRef;

  addItem(item: DragRef<T>): void {
    this._draggables.add(item);
  }
  removeItem(item: DragRef<T>): void {
    this._draggables.delete(item);
  }
  updateDomRect(): void {
    /* computed lazily to avoid stale rectangles */
  }

  createPlaceholder(drag: DragRef<T>): PlaceHolderRef {
    const ref = new PlaceHolderRef();
    const rect = drag.el.getBoundingClientRect();
    const style = ref.attach(this.el).style;
    style.width = `${rect.width}px`;
    style.height = `${rect.height}px`;
    style.flex = `0 0 ${rect.width}px`;
    style.boxSizing = 'border-box';
    this.placeholder = ref;
    this.enter(drag, drag.pointer.x, drag.pointer.y);
    return ref;
  }

  enter(drag: DragRef<T>, x = 0, y = 0): void {
    if (!this.active) {
      this.active = true;
      this.previousIndex = this.indexOf(drag);
      this.strategy.withElementContainer(this.el).start([...this._draggables]);
      this.el.classList.add('ngx-drop-list--active');
    }
    this.strategy.enter(drag, x, y);
  }

  sortItem(drag: DragRef<T>, position: IPosition): number | null {
    if (!this.active || this.disableSort) return null;
    return this.strategy.sort(drag, position.x, position.y)?.currentIndex ?? null;
  }

  finishDrag(drag: DragRef<T>): void {
    if (!this.active) return;
    const currentIndex = this.strategy.getCurrentIndex();
    this.onDrop.emit({
      previousIndex: Math.max(0, this.previousIndex),
      currentIndex,
      item: drag,
      container: this,
      previousContainer: drag.originDropList ?? this,
    });
    this.reset();
  }

  exit(drag: DragRef<T>): void {
    if (!this.active) return;
    this.placeholder?.detach();
    this.reset();
    void drag;
  }
  resetSortTransforms(): void {
    this.reset();
  }
  getFinalIndex(): number {
    return this.strategy.getCurrentIndex();
  }
  getItemIndex(item: DragRef<T>): number {
    return this.indexOf(item);
  }

  private indexOf(item: DragRef<T>): number {
    return [...this.el.children]
      .filter((el) => el !== this.placeholder?.element)
      .findIndex((el) => el === item.el);
  }
  private reset(): void {
    this.active = false;
    this.strategy.reset();
    this.placeholder?.detach();
    this.placeholder = undefined;
    this.el.classList.remove('ngx-drop-list--active');
  }
}
