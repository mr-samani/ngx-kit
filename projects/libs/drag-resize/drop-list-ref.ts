import { EventEmitter } from '@angular/core';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { PositionalSortStrategy } from './sorting/positional-sort-strategy';
import { PlaceHolderRef } from './placeholder-ref';
import { copyEssentialStyles } from './utils/styling';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: DropListGroupRef | null;
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

  /** Whether `other` is a valid drop target reachable from this list. */
  isConnectedTo(other: DropListRef<any>): boolean {
    if (other === (this as any)) return true;
    if (this.connectedTo.includes(other.el) || other.connectedTo.includes(this.el)) return true;
    return !!this.dropListGroup && this.dropListGroup.has(other);
  }

  createPlaceholder(drag: DragRef<T>): PlaceHolderRef {
    const ref = new PlaceHolderRef();
    const rect = drag.el.getBoundingClientRect();
    const el = ref.attach(this.el);
    copyEssentialStyles(drag.el, el);
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.flex = `0 0 ${rect.width}px`;
    el.style.boxSizing = 'border-box';
    el.style.visibility = 'visible';
    el.style.pointerEvents = 'none';
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
