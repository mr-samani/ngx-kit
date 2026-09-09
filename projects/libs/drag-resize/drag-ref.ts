import { signal } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { cloneDragElementInBody } from './utils/clone-drag-element-in-body';

export type DragAxis = 'x' | 'y' | undefined;

let zIndexCounter = 1000;

export class DragRef<T = unknown> {
  data?: T;
  el!: HTMLElement;
  boundary?: HTMLElement;
  lockAxis?: DragAxis;

  dropList: DropListRef<T> | null = null;
  dropListGroup?: DropListGroupRef | null;

  placeholder?: PlaceHolderRef;
  originDropList: DropListRef<T> | null = null;
  originIndex = -1;

  readonly isDragging = signal(false);
  readonly position = signal<IPosition>({ x: 0, y: 0 });

  private startPointer = { x: 0, y: 0 };
  private startRect!: DOMRect;
  private lastPointer = { x: 0, y: 0 };

  private previousTransform = '';
  private previousZIndex = '';

  private moveDx = 0;
  private moveDy = 0;

  private preview?: HTMLElement;
  private previewOffsetX = 0;
  private previewOffsetY = 0;
  private sourceVisibility = '';
  private sourcePointerEvents = '';

  init(): void {
    this.previousTransform = getComputedStyle(this.el).getPropertyValue('transform');
  }

  withDropList(list: DropListRef<T> | null): this {
    if (this.dropList === list) return this;

    this.dropList?.removeItem(this);
    this.dropList = list;
    list?.addItem(this);
    return this;
  }

  clearDropList(): void {
    this.dropList?.removeItem(this);
    this.dropList = null;
  }

  pointerDown(pointer: IPosition): void {
    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };
  }

  startDrag(pointer: IPosition): void {
    this.startRect = this.el.getBoundingClientRect();

    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };
    this.moveDx = 0;
    this.moveDy = 0;

    this.originDropList = this.dropList;
    this.originIndex = this.dropList?.getItemIndex(this) ?? -1;
    this.previousTransform = getComputedStyle(this.el).getPropertyValue('transform');

    this.isDragging.set(true);

    this.previousZIndex = this.el.style.zIndex;
    this.sourceVisibility = this.el.style.visibility;
    this.sourcePointerEvents = this.el.style.pointerEvents;

    this.el.classList.add('ngx-draggable--dragging');
    this.el.style.willChange = 'transform';
    this.el.style.transition = 'none';
    this.el.style.zIndex = String(++zIndexCounter);

    // The real item remains anchored in the list. Its placeholder occupies its
    // layout slot while this body-level preview is the only visible moving item.
    this.placeholder = this.dropList?.createPlaceholder(this);

    const preview = cloneDragElementInBody(
      this.el,
      this.startRect,
      pointer.x,
      pointer.y,
    );

    this.preview = preview.element;
    this.previewOffsetX = preview.offsetX;
    this.previewOffsetY = preview.offsetY;

    this.el.style.visibility = 'hidden';
    this.el.style.pointerEvents = 'none';

    this.updatePreview();
  }

  dragMove(pointer: IPosition): void {
    if (!this.isDragging()) return;

    this.lastPointer = { ...pointer };

    let dx = pointer.x - this.startPointer.x;
    let dy = pointer.y - this.startPointer.y;

    if (this.boundary) {
      dx = checkBoundX(this.startRect, this.boundary.getBoundingClientRect(), dx);
      dy = checkBoundY(this.startRect, this.boundary.getBoundingClientRect(), dy);
    }

    if (this.lockAxis === 'x') dy = 0;
    if (this.lockAxis === 'y') dx = 0;

    this.moveDx = dx;
    this.moveDy = dy;

    this.position.set({ x: dx, y: dy });
    this.updatePreview();
  }

  nudge(dx: number, dy: number): void {
    if (!this.isDragging()) this.startDrag(this.lastPointer);

    this.dragMove({
      x: this.startPointer.x + this.moveDx + dx,
      y: this.startPointer.y + this.moveDy + dy,
    });
  }

  endDrag(): void {
    if (!this.isDragging()) return;

    this.isDragging.set(false);

    this.preview?.remove();
    this.preview = undefined;

    this.el.classList.remove('ngx-draggable--dragging');
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.willChange = '';
    this.el.style.zIndex = this.previousZIndex;
    this.el.style.transition = '';

    // Preserve the accumulated transform exactly as the previous implementation
    // did. The visual preview has already carried the drag movement.
    if (this.dropList) {
      this.el.style.transform = this.previousTransform;
    }

    if (this.dropList) {
      this.dropList.finishDrag(this);
    } else {
      this.placeholder?.detach();
      this.placeholder = undefined;
    }
  }

  cancelDrag(): void {
    if (!this.isDragging()) return;

    this.moveDx = 0;
    this.moveDy = 0;

    this.position.set({ x: 0, y: 0 });

    this.dropList?.exit(this);
    this.clearDropList();

    this.el.style.transform = this.previousTransform;
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.pointerEvents = this.sourcePointerEvents;

    this.endDrag();
  }

  get x(): number {
    return this.moveDx;
  }

  get y(): number {
    return this.moveDy;
  }

  get pointer(): IPosition {
    return this.lastPointer;
  }

  get start(): DOMRect {
    return this.startRect;
  }

  getPlaceholderElement(): HTMLElement | undefined {
    return this.placeholder?.element;
  }

  private updatePreview(): void {
    if (!this.preview) return;

    this.preview.style.transform =
      `translate3d(${this.moveDx}px, ${this.moveDy}px, 0)`;
  }
}
