import { DOCUMENT, inject, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { IDropEvent } from './contracts/IDropEvent';
import { DragDropService } from './services/drag-drop.service';
import type { DropListRef } from './drop-list-ref';
import type { DropListGroupRef } from './drop-list-group-ref';

// ─── Inline utilities (no external dep issues) ──────────────────────────────

function getXY(el: HTMLElement): { x: number; y: number } {
  const trans = getComputedStyle(el).getPropertyValue('transform');
  const matrix = trans.replace(/[^0-9\-.,]/g, '').split(',');
  const x = parseFloat(matrix.length > 6 ? matrix[12] : matrix[4]) || 0;
  const y = parseFloat(matrix.length > 6 ? matrix[13] : matrix[5]) || 0;
  return { x, y };
}

function cloneDragElement(dragEl: HTMLElement, rect: DOMRect): HTMLElement {
  const clone = dragEl.cloneNode(true) as HTMLElement;

  // Copy essential computed styles
  const styles = getComputedStyle(dragEl);
  const keys = [
    'font',
    'font-size',
    'line-height',
    'font-weight',
    'color',
    'background-color',
    'border',
    'border-radius',
    'padding',
    'text-align',
    'vertical-align',
    'display',
    'align-items',
    'justify-content',
    'gap',
  ];
  keys.forEach(k => {
    const v = styles.getPropertyValue(k);
    if (v) clone.style.setProperty(k, v, styles.getPropertyPriority(k));
  });

  clone.innerHTML = dragEl.innerHTML;
  clone.className = dragEl.className + ' ngx-drag-in-body';
  clone.style.position = 'fixed';
  // Use fixed + scroll offset for correct positioning
  clone.style.top = rect.top + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.margin = '0';
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '0.85';
  clone.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)';
  clone.style.zIndex = '99999';
  clone.style.transitionProperty = 'none';
  clone.style.transform = '';
  return clone;
}

// ─── DragRef ────────────────────────────────────────────────────────────────

export class DragRef<T = any> {
  data?: T;
  el!: HTMLElement;
  isDragging = false;
  dropList?: DropListRef | null;
  dropListGroup?: DropListGroupRef | null;

  domRect!: DOMRect;

  /** Ghost position (cumulative translate3d) */
  x = 0;
  y = 0;

  private _prevX = 0;
  private _prevY = 0;
  private _prevDisplay = '';

  private _dropEvent: IDropEvent | null = null;
  private _currentIndex = -1;
  private _currentDropList?: DropListRef | null = null;

  /** Floating ghost element appended to <body> */
  private _ghost?: HTMLElement;

  /** Invisible placeholder sitting inside the drop list */
  private _placeholder?: HTMLElement;

  private _renderer = inject(Renderer2);
  private _doc = inject(DOCUMENT);
  private _service = inject(DragDropService);
  boundary?: HTMLElement;

  // ─── Public API ────────────────────────────────────────────────────────────

  /** Called by sort strategy to animate siblings */
  getPlaceholderElement(): HTMLElement {
    if (!this._placeholder) throw new Error('DragRef: no placeholder');
    return this._placeholder;
  }

  withDropList(dropList: DropListRef | null): this {
    if (this.dropList === dropList) return this;
    this.dropList?.removeItem(this);
    this.dropList = dropList;
    this.dropList?.addItem(this);
    return this;
  }

  init() {
    const xy = getXY(this.el);
    this.x = xy.x;
    this.y = xy.y;
    this.updateDomRect();
  }

  updateDomRect() {
    this.domRect = this.el.getBoundingClientRect();
  }

  pointerDown(pos: IPosition) {
    this._prevX = pos.x;
    this._prevY = pos.y;
  }

  // ─── Drag lifecycle ─────────────────────────────────────────────────────────

  startDrag(pos: IPosition) {
    if (!this.dropListGroup || !this.dropList) return;

    this._currentDropList = this.dropList;
    this._service.updateAllRect();

    // Compute index before hiding the element
    const index = this._service.getDragItemIndex(this);

    this._dropEvent = {
      previousIndex: index,
      previousContainer: this.dropList,
      container: this.dropList,
      currentIndex: index,
      item: this,
    };

    // 1. Create ghost (fixed, follows pointer)
    this._ghost = cloneDragElement(this.el, this.domRect);
    this._doc.body.appendChild(this._ghost);

    // 2. Create placeholder (invisible, stays in list)
    this._placeholder = this._buildPlaceholder();

    // 3. Hide original
    this._prevDisplay = this.el.style.display;
    this._renderer.setStyle(this.el, 'display', 'none', RendererStyleFlags2.Important);

    // 4. Notify list — inserts placeholder, starts snapshot
    this.dropList.enter(this, pos.x, pos.y);

    // 5. Init ghost position
    this.x = 0;
    this.y = 0;
    this._prevX = pos.x;
    this._prevY = pos.y;
  }

  dragMove(pos: IPosition) {
    const dx = pos.x - this._prevX;
    const dy = pos.y - this._prevY;

    // Move ghost
    this.x += dx;
    this.y += dy;
    if (this._ghost) {
      this._ghost.style.transform = `translate3d(${Math.round(this.x)}px, ${Math.round(this.y)}px, 0)`;
    }

    this._prevX = pos.x;
    this._prevY = pos.y;

    if (!this.dropListGroup) return;

    // Cross-list detection
    const list = this._service.getDropListFromPointerPosition(pos);
    if (list && list !== this._currentDropList) {
      this._currentDropList?.exit(this);
      this._currentDropList = list;
      this._currentDropList.enter(this, pos.x, pos.y);
    }

    // Re-sort in current list
    if (this._currentDropList) {
      const result = this._currentDropList.sortItem(this, pos, { x: dx, y: dy });
      if (result !== null) this._currentIndex = result;
    }
  }

  endDrag() {
    if (!this.dropList) return;

    // Reset all sibling transforms across all lists
    this._service.listSnapshot.forEach(s => s.item.resetSortTransforms());

    // Restore original element
    this.el.style.display = this._prevDisplay;

    // Remove ghost
    this._ghost?.remove();
    this._ghost = undefined;

    // Remove placeholder
    this._placeholder?.remove();
    this._placeholder = undefined;

    this.x = 0;
    this.y = 0;
    this._prevX = 0;
    this._prevY = 0;

    if (this._dropEvent && this._currentDropList) {
      // Use the strategy's tracked index (DOM position of placeholder)
      const finalIdx = this._currentDropList.getFinalIndex();
      this._dropEvent.currentIndex = finalIdx >= 0 ? finalIdx : this._currentIndex;
      this._dropEvent.container = this._currentDropList;
      this._currentDropList.exit(this);
      this._currentDropList.onDrop.emit(this._dropEvent);
    }

    this._dropEvent = null;
    this._currentDropList = null;
    this._currentIndex = -1;
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private _buildPlaceholder(): HTMLElement {
    // If the list has a custom *NgxPlaceholder template, use it
    const custom = this.dropList?._placeHolderRef?.getElement(this);
    if (custom) return custom;

    // Default: invisible clone preserving dimensions
    const ph = this.el.cloneNode(false) as HTMLElement;
    ph.removeAttribute('id');
    ph.classList.add('ngx-drag-placeholder');
    // keep layout dimensions but invisible
    ph.style.visibility = 'hidden';
    ph.style.pointerEvents = 'none';
    ph.style.transition = 'none';
    ph.style.transform = '';
    ph.style.opacity = '0';
    // Force same box size so the list doesn't jump
    ph.style.boxSizing = 'border-box';
    ph.style.width = this.domRect.width + 'px';
    ph.style.height = this.domRect.height + 'px';
    ph.style.minWidth = '';
    ph.style.minHeight = '';
    ph.style.maxWidth = '';
    ph.style.maxHeight = '';
    return ph;
  }
}
