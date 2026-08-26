import { EventEmitter, inject } from '@angular/core';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { NGX_PLACEHOLDER } from './directives/ngx-place-holder.directive';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { PositionalSortStrategy } from './sorting/positional-sort-strategy';

export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort: boolean = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: DropListGroupRef | null;

  _draggables = new Set<DragRef>();
  domRect!: DOMRect;

  _placeHolderRef = inject(NGX_PLACEHOLDER, { optional: true });
  onDrop = new EventEmitter<IDropEvent<T>>();

  private _isDragging = false;
  private _sortStrategy = new PositionalSortStrategy();

  // ─── Registration ────────────────────────────────────────────────────────────

  updateDomRect() {
    this.domRect = this.el.getBoundingClientRect();
  }

  addItem(item: DragRef) {
    this._draggables.add(item);
  }

  removeItem(item: DragRef) {
    this._draggables.delete(item);
  }

  // ─── Session ─────────────────────────────────────────────────────────────────

  /**
   * Start a drag session / enter this list from another.
   */
  enter(currentDragItem: DragRef, pointerX = 0, pointerY = 0): void {
    if (!this._isDragging) {
      // Detect RTL from container or document
      const dir = getComputedStyle(this.el).direction;
      this._sortStrategy.withRtl(dir === 'rtl');
      this._sortStrategy.withElementContainer(this.el);

      // Snapshot all non-dragging items
      const siblings = Array.from(this._draggables).filter(d => d !== currentDragItem);
      this._sortStrategy.start(siblings);

      this._isDragging = true;
      this.el.classList.add('ngx-drop-list-dragging');
    }

    // Place placeholder in the container at the right position
    try {
      this._sortStrategy.enter(currentDragItem, pointerX, pointerY);
    } catch {
      // placeholder not ready yet on first enter — that's ok
    }
  }

  /**
   * Item exited this list.
   */
  exit(currentDragItem: DragRef): void {
    if (!this._isDragging) return;

    this._isDragging = false;
    this.el.classList.remove('ngx-drop-list-dragging');
    this._sortStrategy.reset();

    // Remove placeholder from DOM
    try {
      const ph = currentDragItem.getPlaceholderElement();
      ph?.remove();
    } catch {
      /* placeholder might already be gone */
    }
  }

  /**
   * Sort on pointer-move. Returns new placeholder index or null.
   */
  sortItem(dragItem: DragRef, position: IPosition, delta: IPosition): number | null {
    if (!this._isDragging || this.disableSort) return null;

    const result = this._sortStrategy.sort(dragItem, position.x, position.y, delta);
    if (result !== null) {
      return result.currentIndex;
    }
    return null;
  }

  /** Returns current visual index of the placeholder. */
  getItemIndex(item: DragRef): number {
    return this._sortStrategy.getItemIndex(item);
  }

  /**
   * Called from DragRef.endDrag() — cleans up transforms on all lists.
   */
  resetSortTransforms(): void {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.el.classList.remove('ngx-drop-list-dragging');
    this._sortStrategy.reset();
  }

  /** Get the final drop index from the strategy */
  getFinalIndex(): number {
    return this._sortStrategy.getCurrentIndex();
  }
}
