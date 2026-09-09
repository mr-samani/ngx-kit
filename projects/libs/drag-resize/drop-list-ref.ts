import { EventEmitter } from '@angular/core';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { PositionalSortStrategy } from './sorting/positional-sort-strategy';
import { PlaceHolderRef } from './placeholder-ref';
import { copyComputedStyleTree } from './utils/styling';

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
    if (this.el) (this.el as any).__ngxDragItems = this._draggables;
  }

  removeItem(item: DragRef<T>): void {
    this._draggables.delete(item);
    if (this.el) (this.el as any).__ngxDragItems = this._draggables;
  }

  isConnectedTo(other: DropListRef<any>): boolean {
    if (other === this) return true;
    if (this.connectedTo.includes(other.el) || other.connectedTo.includes(this.el)) return true;
    return !!this.dropListGroup && this.dropListGroup.has(other);
  }

  createPlaceholder(drag: DragRef<T>): PlaceHolderRef {
    // There is exactly one placeholder for the active drag.
    this.placeholder?.detach();

    const ref = new PlaceHolderRef();
    ref.dropList = this;
    const source = drag.el;
    const rect = source.getBoundingClientRect();

    ref.attach(this.el, source);
    this.copyPlaceholderGeometry(source, ref.element!, rect);

    this.placeholder = ref;
    drag.placeholder = ref;

    this.enter(drag, drag.pointer.x, drag.pointer.y);

    return ref;
  }

  enter(drag: DragRef<T>, x = 0, y = 0): void {
    if (!this.active) {
      this.active = true;
      this.previousIndex = this.indexOf(drag);

      // Sorting strategy reads the live DOM. Expose the authoritative refs
      // without importing DropListRef back into the strategy.
      (this.el as any).__ngxDragItems = this._draggables;

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
      previousIndex: Math.max(0, drag.originIndex >= 0 ? drag.originIndex : this.previousIndex),
      currentIndex,
      item: drag,
      container: this,
      previousContainer: drag.originDropList ?? this,
    });

    this.reset();
  }

  exit(_drag: DragRef<T>): void {
    if (!this.active) return;

    this.placeholder?.detach();
    this.reset();
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
    return Array.from(this.el.children).filter(
      (el) =>
        el !== this.placeholder?.element &&
        !el.classList.contains('ngx-drag-in-body'),
    ).findIndex((el) => el === item.el);
  }

  private reset(): void {
    this.active = false;
    this.strategy.reset();
    this.placeholder?.detach();
    this.placeholder = undefined;
    this.el.__ngxDragItems = undefined;
    this.el.classList.remove('ngx-drop-list--active');
  }

  private copyPlaceholderGeometry(
    source: HTMLElement,
    placeholder: HTMLElement,
    rect: DOMRect,
  ): void {
    copyComputedStyleTree(source, placeholder);

    placeholder.style.setProperty('width', `${rect.width}px`, 'important');
    placeholder.style.setProperty('height', `${rect.height}px`, 'important');
    placeholder.style.setProperty('min-width', `${rect.width}px`, 'important');
    placeholder.style.setProperty('min-height', `${rect.height}px`, 'important');
    placeholder.style.setProperty('max-width', `${rect.width}px`, 'important');
    placeholder.style.setProperty('max-height', `${rect.height}px`, 'important');
    placeholder.style.setProperty('visibility', 'visible', 'important');
    placeholder.style.setProperty('opacity', '0.16', 'important');
    placeholder.style.setProperty('pointer-events', 'none', 'important');
    placeholder.style.setProperty('transform', 'none', 'important');
    placeholder.style.setProperty('transition', 'none', 'important');
    placeholder.style.setProperty('animation', 'none', 'important');
    placeholder.style.setProperty('box-sizing', 'border-box', 'important');
  }
}
