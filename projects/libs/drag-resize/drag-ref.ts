import { signal } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { DropListGroupRef } from './drop-list-group-ref';

export class DragRef<T = unknown> {
  data?: T;
  el!: HTMLElement;
  boundary?: HTMLElement;
  dropList: DropListRef<T> | null = null;
  dropListGroup?: DropListGroupRef | null;
  placeholder?: PlaceHolderRef;

  readonly isDragging = signal(false);
  readonly position = signal<IPosition>({ x: 0, y: 0 });

  private startPointer = { x: 0, y: 0 };
  private startRect!: DOMRect;
  private lastPointer = { x: 0, y: 0 };
  private previousTransform = '';
  originDropList: DropListRef<T> | null = null;
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
    this.startRect = this.el.getBoundingClientRect();
    this.startPointer = { ...pointer };
    this.lastPointer = { ...pointer };
    this.moveDx = 0;
    this.moveDy = 0;
    this.originDropList = this.dropList;
    this.isDragging.set(true);
    this.el.classList.add('ngx-draggable--dragging');
    this.el.style.willChange = 'transform';
    this.el.style.transition = 'none';
    this.el.style.zIndex = '1000';
    this.placeholder = this.dropList?.createPlaceholder(this);
  }

  dragMove(pointer: IPosition): void {
    if (!this.isDragging()) return;
    this.lastPointer = { ...pointer };
    this.moveDx = pointer.x - this.startPointer.x;
    this.moveDy = pointer.y - this.startPointer.y;
    this.position.set({ x: this.moveDx, y: this.moveDy });
    this.applyTransform();
  }

  endDrag(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.el.classList.remove('ngx-draggable--dragging');
    this.el.style.transform = this.previousTransform;
    this.el.style.willChange = '';
    this.el.style.zIndex = '';
    this.el.style.transition = '';
    this.placeholder?.detach();
    this.placeholder = undefined;
    this.dropList?.finishDrag(this);
  }

  cancelDrag(): void {
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
    const x = this.moveDx;
    const y = this.moveDy;
    this.el.style.transform = `${this.previousTransform && this.previousTransform !== 'none' ? this.previousTransform + ' ' : ''}translate3d(${x}px, ${y}px, 0)`;
  }
}
