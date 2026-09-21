import { signal } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { DragDropService } from './services/drag-drop.service';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { cloneDragElementInBody } from './utils/clone-drag-element-in-body';

export type DragAxis = 'x' | 'y' | undefined;

let zIndexCounter = 1000;

export class DragRef<T = unknown> {
  data?: T;
  el!: HTMLElement;
  boundary?: HTMLElement;
  lockAxis?: DragAxis;

  /**
   * The list this draggable BELONGS to (set by the template). Dragging never changes it.
   * The list the pointer is currently over is `activeDropList`.
   */
  dropList: DropListRef<T> | null = null;
  dropListGroup?: DropListGroupRef | null;
  /** Used to find the drop list under the pointer. Set by the directive; optional. */
  service?: DragDropService;
  /** Drop list currently under the pointer during a drop-list drag (null = outside every list). */
  activeDropList: DropListRef<T> | null = null;

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
  private scrollCompensation = { x: 0, y: 0 };
  private preview?: HTMLElement;
  private previewOffsetX = 0;
  private previewOffsetY = 0;
  private sourceVisibility = '';
  private sourceDisplay = '';
  private sourcePointerEvents = '';
  private sourceTransition = '';

  /** True while a drop-list drag (body preview + placeholder) is in progress. Free drag: always false. */
  private listDrag = false;
  private cachedLists: DropListRef<T>[] = [];
  private lastEffective: IPosition = { x: 0, y: 0 };
  private scrollListener?: () => void;
  private resizeListener?: () => void;

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
    this.scrollCompensation = { x: 0, y: 0 };

    // Only draggables that are direct children of their drop list take part in sorting.
    // Everything else is a plain free drag.
    const list = this.dropList && this.dropList.el === this.el.parentElement ? this.dropList : null;
    this.originDropList = list;
    this.originIndex = list?.getItemIndex(this) ?? -1;
    this.previousTransform = getComputedStyle(this.el).getPropertyValue('transform');

    this.isDragging.set(true);

    this.previousZIndex = this.el.style.zIndex;
    this.sourceVisibility = this.el.style.visibility;
    this.sourceDisplay = this.el.style.display;
    this.sourcePointerEvents = this.el.style.pointerEvents;
    this.sourceTransition = this.el.style.transition;

    this.el.classList.add('ngx-draggable--dragging');
    this.el.style.willChange = 'transform';
    this.el.style.transition = 'none';
    this.el.style.zIndex = String(++zIndexCounter);

    /*
     * IMPORTANT:
     *
     * Normal Drag:
     *   absolutely nothing changes in the element's rendering mechanism.
     *
     * DropList Drag:
     *   create a body-level preview because the original element can be
     *   inside an overflow:auto/hidden container such as a Kanban column.
     */
    if (list) {
      this.listDrag = true;

      // Order matters: clone while the source is still visible and fully styled, hide it,
      // and only THEN measure (the placeholder takes over the source's slot).
      const preview = cloneDragElementInBody(this.el, this.startRect, pointer.x, pointer.y);

      this.preview = preview.element;
      this.previewOffsetX = preview.offsetX;
      this.previewOffsetY = preview.offsetY;

      this.el.style.visibility = 'hidden';
      this.el.style.display = 'none';
      this.el.style.pointerEvents = 'none';

      this.beginListDrag(list, pointer);
      this.updatePreview();
    } else {
      // KEEP THE ORIGINAL DRAG BEHAVIOR.
      this.applyTransform();
    }
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

    this.position.set({
      x: dx,
      y: dy,
    });

    if (this.listDrag) {
      this.updatePreview();
      // Sorting follows the (axis/boundary constrained) pointer, not the raw one.
      this.lastEffective = { x: this.startPointer.x + dx, y: this.startPointer.y + dy };
      this.updateDropTarget(this.lastEffective);
    } else {
      this.applyTransform();
    }
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

    if (this.listDrag) {
      this.isDragging.set(false);
      this.finishListDrag(true);
      return;
    }

    // ---- free drag: unchanged ----
    this.isDragging.set(false);

    this.placeholder?.detach();
    this.placeholder = undefined;

    this.preview?.remove();
    this.preview = undefined;

    this.el.classList.remove('ngx-draggable--dragging');

    this.el.style.visibility = this.sourceVisibility;
    this.el.style.display = this.sourceDisplay;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.willChange = '';
    this.el.style.zIndex = this.previousZIndex;
  }

  cancelDrag(): void {
    if (!this.isDragging()) return;

    this.moveDx = 0;
    this.moveDy = 0;

    this.position.set({ x: 0, y: 0 });

    if (this.listDrag) {
      // Rollback: nothing was ever committed to the DOM or the model, so restoring is just cleanup.
      this.isDragging.set(false);
      this.finishListDrag(false);
      return;
    }

    // ---- free drag: unchanged ----
    this.el.style.transform = this.previousTransform;
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.scrollCompensation = { x: 0, y: 0 };

    this.endDrag();
  }

  /** Abort without emitting anything (the directive was destroyed mid-drag). Idempotent. */
  dispose(): void {
    if (!this.listDrag) return;
    this.isDragging.set(false);
    this.finishListDrag(false);
  }

  /** True while a drop-list drag is running. */
  get isListDrag(): boolean {
    return this.listDrag;
  }

  /** Inline `display` the source element had before it was hidden for the drag. */
  get originalDisplay(): string {
    return this.sourceDisplay;
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

  /**
   * صدا زده می‌شود هر بار که container یا window در حین درگ اسکرول شود
   * (چه توسط auto-scroll خودمان، چه با wheel/اسکرول‌بار دستی کاربر).
   * transform را فوراً تصحیح می‌کند تا عنصر زیر پوینتر بماند.
   */
  notifyScroll(dx: number, dy: number): void {
    if (!this.isDragging()) return;
    // Drop-list drags are position:fixed in <body> and follow the pointer in viewport space, so
    // scrolling needs no compensation; sorting listens to scroll on its own (see beginListDrag).
    if (this.listDrag) return;
    this.scrollCompensation = {
      x: this.scrollCompensation.x + dx,
      y: this.scrollCompensation.y + dy,
    };
    this.applyTransform();
  }

  private applyTransform(): void {
    const base =
      this.previousTransform && this.previousTransform !== 'none'
        ? this.previousTransform + ' '
        : '';

    const tx = this.moveDx + this.scrollCompensation.x;
    const ty = this.moveDy + this.scrollCompensation.y;

    this.el.style.transform = `${base}translate3d(${tx}px, ${ty}px, 0)`;
  }
  // -------------------------------------------------------------------------------------
  // drop-list drag
  // -------------------------------------------------------------------------------------

  private beginListDrag(origin: DropListRef<T>, pointer: IPosition): void {
    const doc = this.el.ownerDocument;
    const win = doc.defaultView ?? window;

    const lists = new Set<DropListRef<T>>([origin]);
    for (const l of this.service?.dropLists() ?? []) lists.add(l as DropListRef<T>);
    this.cachedLists = Array.from(lists);
    // Foreign lists are measured as they are now (no placeholder in them yet)...
    for (const l of this.cachedLists) if (l !== origin) l._cacheGeometry();

    this.lastEffective = { ...pointer };
    this.activeDropList = origin;
    origin.enter(this, pointer.x, pointer.y);
    // ...the origin list AFTER its placeholder took over the source's slot, so its box still
    // covers the whole list (the hidden source no longer occupies space).
    origin._cacheGeometry();

    this.scrollListener = () => {
      for (const l of this.cachedLists) l._onScroll();
      this.updateDropTarget(this.lastEffective);
    };
    this.resizeListener = () => {
      for (const l of this.cachedLists) l._refresh();
      this.updateDropTarget(this.lastEffective);
    };
    // Capture: `scroll` does not bubble, and any ancestor (or the page) may be the one scrolling.
    doc.addEventListener('scroll', this.scrollListener, { capture: true, passive: true });
    win.addEventListener('resize', this.resizeListener, { passive: true });
  }

  /** Decide which list is under the pointer, switch if needed, then re-sort in the active one. */
  private updateDropTarget(pointer: IPosition): void {
    const origin = this.originDropList;
    if (!origin) return;

    const next = this.service
      ? (this.service.findDropList(pointer, this.activeDropList, origin, this.el) as DropListRef<T> | null)
      : origin._containsPoint(pointer.x, pointer.y)
        ? origin
        : null;

    if (next !== this.activeDropList) {
      this.activeDropList?.exit(this);
      this.activeDropList = next;
      next?.enter(this, pointer.x, pointer.y);
    } else {
      next?.sortItem(this, pointer);
    }
  }

  /**
   * Single teardown path for every way a drop-list drag can end (drop on a list, drop outside,
   * Escape, pointercancel, destroy). Everything transient is removed here, so nothing can leak
   * regardless of how the drag ended. Only then is the drop event emitted.
   */
  private finishListDrag(commit: boolean): void {
    const doc = this.el.ownerDocument;
    if (this.scrollListener) doc.removeEventListener('scroll', this.scrollListener, { capture: true });
    if (this.resizeListener) (doc.defaultView ?? window).removeEventListener('resize', this.resizeListener);
    this.scrollListener = this.resizeListener = undefined;

    const target = commit ? this.activeDropList : null;
    const event = target?._finish(this, true) ?? null;
    for (const l of this.cachedLists) l._release(this);

    this.preview?.remove();
    this.preview = undefined;
    this.placeholder = undefined;
    this.activeDropList = null;
    this.cachedLists = [];
    this.listDrag = false;

    // The source element is put back exactly as it was (its transform was never touched).
    this.el.classList.remove('ngx-draggable--dragging');
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.display = this.sourceDisplay;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.transition = this.sourceTransition;
    this.el.style.willChange = '';
    this.el.style.zIndex = this.previousZIndex;

    if (event && target) target.onDrop.emit(event);
  }

  private updatePreview(): void {
    if (!this.preview) return;

    this.preview.style.transform = `translate3d(${this.moveDx}px, ${this.moveDy}px, 0)`;
  }
}
