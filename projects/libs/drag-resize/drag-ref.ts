import { signal } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { checkBoundX, checkBoundY } from './utils/check-boundary';

export type DragAxis = 'x' | 'y' | undefined;

let zIndexCounter = 1000;

export class DragRef<T = unknown> {
  data?: T;
  el!: HTMLElement;
  /** Element whose bounding rect constrains the drag. Actually enforced (previously a no-op). */
  boundary?: HTMLElement;
  /** Restrict movement to a single axis. */
  lockAxis?: DragAxis;

  dropList: DropListRef<T> | null = null;
  dropListGroup?: DropListGroupRef | null;

  placeholder?: PlaceHolderRef;
  originDropList: DropListRef<T> | null = null;

  readonly isDragging = signal(false);
  readonly position = signal<IPosition>({ x: 0, y: 0 });

  private startPointer = { x: 0, y: 0 };
  private startRect!: DOMRect;
  private lastPointer = { x: 0, y: 0 };

  /**
   * Transform that existed before the current drag started.
   */
  private previousTransform = '';

  /**
   * Transform that existed before the current drag started.
   * Used when a drag is cancelled.
   */
  private previousZIndex = '';

  private moveDx = 0;
  private moveDy = 0;

  init(): void {
    this.previousTransform = this.el.style.transform;
  }

  withDropList(list: DropListRef<T> | null): this {
    this.dropList = list;
    list?.addItem(this);
    return this;
  }

  pointerDown(pointer: IPosition): void {
    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };
  }

  startDrag(pointer: IPosition): void {
    /**
     * IMPORTANT:
     *
     * The element may already have a committed transform from a previous drag.
     * getBoundingClientRect() therefore gives us its actual current position.
     *
     * We do NOT need to parse the transform here.
     */
    this.startRect = this.el.getBoundingClientRect();

    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };

    this.moveDx = 0;
    this.moveDy = 0;

    this.originDropList = this.dropList;

    /**
     * Capture the current inline transform as the base transform.
     *
     * Example:
     *
     * translate3d(100px, 50px, 0)
     *
     * The next drag will start from this position.
     */
    this.previousTransform = this.el.style.transform;

    this.isDragging.set(true);

    this.previousZIndex = this.el.style.zIndex;

    this.el.classList.add('ngx-draggable--dragging');

    this.el.style.willChange = 'transform';
    this.el.style.transition = 'none';
    this.el.style.zIndex = String(++zIndexCounter);

    this.placeholder = this.dropList?.createPlaceholder(this);
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

    if (this.lockAxis === 'x') {
      dy = 0;
    }

    if (this.lockAxis === 'y') {
      dx = 0;
    }

    this.moveDx = dx;
    this.moveDy = dy;

    this.position.set({
      x: dx,
      y: dy,
    });

    this.applyTransform();
  }

  /** Nudge by a fixed pixel delta — used for keyboard-driven dragging. */
  nudge(dx: number, dy: number): void {
    const wasDragging = this.isDragging();

    if (!wasDragging) {
      this.startDrag(this.lastPointer);
    }

    this.dragMove({
      x: this.startPointer.x + this.moveDx + dx,
      y: this.startPointer.y + this.moveDy + dy,
    });
  }

  /**
   * Commits the current drag position.
   *
   * This means the next drag automatically starts from the
   * element's actual transformed position.
   */
  endDrag(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.el.classList.remove('ngx-draggable--dragging');
    this.el.style.willChange = '';
    this.el.style.zIndex = this.previousZIndex;
    this.el.style.transition = '';
    this.placeholder?.detach();
    this.placeholder = undefined;
    this.dropList?.finishDrag(this);
  }

  /**
   * Cancels the drag and restores the exact state before dragging.
   */
  cancelDrag(): void {
    if (!this.isDragging()) return;

    this.moveDx = 0;
    this.moveDy = 0;

    this.position.set({
      x: 0,
      y: 0,
    });

    this.dropList?.exit(this);
    this.dropList = this.originDropList;

    /**
     * Restore the transform BEFORE ending the drag.
     */
    this.el.style.transform = this.previousTransform;

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

  private applyTransform(): void {
    const base =
      this.previousTransform && this.previousTransform !== 'none'
        ? this.previousTransform + ' '
        : '';

    this.el.style.transform = `${base}translate3d(${this.moveDx}px, ${this.moveDy}px, 0)`;
  }
}
