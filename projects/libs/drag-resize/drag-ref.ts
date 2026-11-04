import { signal } from '@angular/core';
import { IPosition } from './contracts/IPosition';
import { DropListRef } from './drop-list-ref';
import { PlaceHolderRef } from './placeholder-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { DragDropService } from './services/drag-drop.service';
import { checkBoundX, checkBoundY } from './utils/check-boundary';
import { DragPreviewRef } from './drag-preview-ref';
import {
  ILinearTransform,
  applyLinear,
  convertPointBetweenDocuments,
  getLocalToViewportMatrix,
  invertLinear,
} from './utils/coordinate-transform';

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

  preview?: DragPreviewRef;

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
  private sourceVisibility = '';
  private sourceDisplay = '';
  private sourcePointerEvents = '';
  private sourceTransition = '';
  private sourceWillChange = '';
  private sourceTransform = '';

  /** True while a drop-list drag (body preview + placeholder) is in progress. Free drag: always false. */
  private listDrag = false;
  private cachedLists: DropListRef<T>[] = [];
  /**
   * Candidate lists for hit-testing, filtered (connected to the origin; not inside the dragged
   * element) and sorted deepest-first — both computed ONCE, not on every pointer move, since
   * neither ever changes mid-drag. Kept in sync with the live registry (see `dropListsSnapshot`)
   * so a list that appears or disappears mid-drag (e.g. behind an `@if`) is still picked up.
   */
  private dropCandidates: { list: DropListRef<T>; depth: number }[] = [];
  private dropListsSnapshot: readonly DropListRef<any>[] | null = null;
  private lastEffective: IPosition = { x: 0, y: 0 };
  private scrollListener?: () => void;
  private resizeListener?: () => void;
  /**
   * Every document that hosts a candidate list (the source document, plus any same-origin iframe
   * such as a page-builder canvas) needs its own scroll/resize listeners: `scroll` does not cross
   * the iframe boundary, so scrolling the canvas never reaches a listener on the parent page.
   */
  private readonly documentListeners = new Map<Document, () => void>();
  /** viewport → local matrix of the dragged element, computed once per free drag. */
  private freeDragInverse: ILinearTransform | null | undefined;

  init(): void {
    this.previousTransform =
      this.el.ownerDocument.defaultView?.getComputedStyle(this.el).transform ?? '';
    this.sourceTransform = this.el.style.transform;
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
    this.freeDragInverse = undefined;

    // Only draggables that are direct children of their drop list take part in sorting.
    // Everything else is a plain free drag.
    const list = this.dropList && this.dropList.el === this.el.parentElement ? this.dropList : null;
    this.originDropList = list;
    this.originIndex = list?.getItemIndex(this) ?? -1;
    const win = this.el.ownerDocument.defaultView;
    this.previousTransform = win?.getComputedStyle(this.el).transform ?? '';
    this.sourceTransform = this.el.style.transform;

    this.isDragging.set(true);

    this.previousZIndex = this.el.style.zIndex;
    this.sourceVisibility = this.el.style.visibility;
    this.sourceDisplay = this.el.style.display;
    this.sourcePointerEvents = this.el.style.pointerEvents;
    this.sourceTransition = this.el.style.transition;
    this.sourceWillChange = this.el.style.willChange;

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
      this.preview ??= new DragPreviewRef();
      this.preview.attach(this.el, this.startRect);

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

  /**
   * Keyboard sorting for list items: jump by whole SLOTS instead of pixels (an 8px step can
   * never cross the centre of a 190px card), and hop to the neighbouring connected list when the
   * edge of the current one is reached — Left/Right between kanban columns, Up/Down between
   * the sections of a column. Returns `false` for free drags (use `nudge`).
   */
  nudgeToSlot(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    if (!this.listDrag) return false;
    if (!this.isDragging()) this.startDrag(this.lastPointer);
    const list = this.activeDropList;
    if (!list?.el) return true;

    const vertical = direction === 'up' || direction === 'down';
    const sign = direction === 'down' || direction === 'right' ? 1 : -1;
    const cur = { x: this.startPointer.x + this.moveDx, y: this.startPointer.y + this.moveDy };
    const listAxis = list.getAxis();
    // A grid has no single main axis: step through its slots along the pressed key's axis.
    const axis: 'x' | 'y' = listAxis === 'grid' ? (vertical ? 'y' : 'x') : listAxis;

    let target: IPosition | null = null;
    if ((axis === 'y') === vertical) target = this.neighbourSlot(list, axis, sign, cur);
    target ??= this.neighbourList(list, vertical ? 'y' : 'x', sign, cur);
    if (target) this.dragMove(target);
    return true;
  }

  private neighbourSlot(
    list: DropListRef<T>,
    axis: 'x' | 'y',
    sign: 1 | -1,
    cur: IPosition,
  ): IPosition | null {
    const mid = (r: DOMRect) => (axis === 'y' ? r.top + r.height / 2 : r.left + r.width / 2);
    const slots = Array.from(list.el.children)
      .filter(
        (n): n is HTMLElement =>
          n instanceof HTMLElement &&
          n !== this.el &&
          !n.classList.contains('ngx-drag-preview') &&
          n.getClientRects().length > 0,
      )
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .sort((a, b) => mid(a.r) - mid(b.r));
    const p = slots.findIndex((s) => s.el.classList.contains('ngx-drag-placeholder'));
    const next = slots[p + sign];
    if (p < 0 || !next) return null;
    // a little PAST the neighbour's centre, beyond the sort hysteresis
    const past = mid(next.r) + 8 * sign;
    return axis === 'y' ? { x: cur.x, y: past } : { x: past, y: cur.y };
  }

  private neighbourList(
    from: DropListRef<T>,
    along: 'x' | 'y',
    sign: 1 | -1,
    cur: IPosition,
  ): IPosition | null {
    const doc = this.el.ownerDocument;
    const origin = visibleRect(from.el);
    if (!origin) return null;
    let best: { rect: VisibleRect; score: number } | null = null;

    for (const l of this.cachedLists) {
      if (l === from || !l.el || l.el.ownerDocument !== doc) continue;
      const r = visibleRect(l.el);
      if (!r || r.width < 8 || r.height < 8) continue;

      const dist =
        along === 'x'
          ? (r.left + r.width / 2 - (origin.left + origin.width / 2)) * sign
          : (r.top + r.height / 2 - (origin.top + origin.height / 2)) * sign;
      if (dist <= 4) continue;

      let score: number;
      if (along === 'x') {
        // prefer the list that is level with the pointer
        const off = Math.max(r.top - cur.y, 0, cur.y - r.bottom);
        score = dist + off * 0.5;
      } else {
        // Up/Down only moves between lists that overlap horizontally (sections of one column)
        const overlap = Math.min(r.right, origin.right) - Math.max(r.left, origin.left);
        if (overlap < Math.min(r.width, origin.width) * 0.5) continue;
        score = dist;
      }
      if (!best || score < best.score) best = { rect: r, score };
    }
    if (!best) return null;

    const r = best.rect;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    return along === 'y'
      ? { x: clamp(cur.x, r.left + 8, r.right - 8), y: sign > 0 ? r.top + 8 : r.bottom - 8 }
      : { x: r.left + r.width / 2, y: clamp(cur.y, r.top + 8, r.bottom - 8) };
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

    this.preview?.detach();
    this.preview = undefined;

    this.el.classList.remove('ngx-draggable--dragging');

    this.el.style.visibility = this.sourceVisibility;
    this.el.style.display = this.sourceDisplay;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.willChange = this.sourceWillChange;
    this.el.style.transition = this.sourceTransition;
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
    this.el.style.transform = this.sourceTransform;
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.scrollCompensation = { x: 0, y: 0 };

    this.endDrag();
  }

  /** Abort without emitting anything (the directive was destroyed mid-drag). Idempotent. */
  dispose(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.position.set({ x: 0, y: 0 });
    if (this.listDrag) {
      this.finishListDrag(false);
      return;
    }
    this.el.style.transform = this.sourceTransform;
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.display = this.sourceDisplay;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.transition = this.sourceTransition;
    this.el.style.willChange = this.sourceWillChange;
    this.el.style.zIndex = this.previousZIndex;
    this.el.classList.remove('ngx-draggable--dragging');
    this.scrollCompensation = { x: 0, y: 0 };
    this.position.set({ x: 0, y: 0 });
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
    if (this.freeDragInverse === undefined) {
      // Includes the element's own (pre-drag) transform: the translate is appended after it.
      this.freeDragInverse = invertLinear(getLocalToViewportMatrix(this.el, true));
    }
    const local = applyLinear(this.freeDragInverse, { x: tx, y: ty });

    this.el.style.transform = `${base}translate3d(${local.x}px, ${local.y}px, 0)`;
  }
  // -------------------------------------------------------------------------------------
  // drop-list drag
  // -------------------------------------------------------------------------------------

  private beginListDrag(origin: DropListRef<T>, pointer: IPosition): void {
    const doc = this.el.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;

    this.dropListsSnapshot = null; // force refreshDropCandidates() to do a full pass below
    this.refreshDropCandidates(origin);

    this.lastEffective = { ...pointer };
    this.activeDropList = origin;
    origin.enter(this, pointer.x, pointer.y);
    // The origin is (re-)measured AFTER its placeholder took over the source's slot, so its box
    // still covers the whole list (the hidden source no longer occupies space).
    origin._cacheGeometry();

    this.scrollListener = () => {
      for (const l of this.cachedLists) l._onScroll();
      this.updateDropTarget(this.lastEffective);
    };
    this.resizeListener = () => {
      for (const l of this.cachedLists) l._refresh();
      this.updateDropTarget(this.lastEffective);
    };
    this.syncDocumentListeners();
  }

  /**
   * Keeps scroll/resize listeners attached to every document that currently hosts a candidate
   * list. Capture: `scroll` does not bubble, and any ancestor (or the page) may be scrolling.
   */
  private syncDocumentListeners(): void {
    if (!this.scrollListener || !this.resizeListener) return;
    const scroll = this.scrollListener;
    const resize = this.resizeListener;

    const wanted = new Set<Document>([this.el.ownerDocument]);
    for (const list of this.cachedLists) {
      const doc = list.el?.ownerDocument;
      if (doc) wanted.add(doc);
    }

    for (const [doc, remove] of this.documentListeners) {
      if (!wanted.has(doc)) {
        remove();
        this.documentListeners.delete(doc);
      }
    }
    for (const doc of wanted) {
      const win = doc.defaultView;
      if (!win || this.documentListeners.has(doc)) continue;
      doc.addEventListener('scroll', scroll, { capture: true, passive: true });
      win.addEventListener('resize', resize, { passive: true });
      this.documentListeners.set(doc, () => {
        doc.removeEventListener('scroll', scroll, { capture: true });
        win.removeEventListener('resize', resize);
      });
    }
  }

  /**
   * Recomputes which registered lists are valid targets for this drag — connected to the
   * origin, and not nested inside the element being dragged — plus each one's nesting depth.
   *
   * `DragDropService.dropLists()` is an Angular signal: its array is a NEW reference only when a
   * list actually registers or unregisters, so the check below is a single reference comparison
   * on every pointer move and the (heavier) connectivity/containment/depth work below it only
   * runs on the rare event a list appears or disappears mid-drag — never on every pointer move.
   */
  private refreshDropCandidates(origin: DropListRef<T>): void {
    const all = this.service?.dropLists() ?? [];
    if (all === this.dropListsSnapshot) return;
    this.dropListsSnapshot = all;

    const already = new Set(this.dropCandidates.map((c) => c.list));
    const next: { list: DropListRef<T>; depth: number }[] = [{ list: origin, depth: origin.depth }];
    for (const l of all as DropListRef<T>[]) {
      if (l === origin || !l.el || !origin.isConnectedTo(l)) continue;
      if (this.el !== l.el && this.el.contains(l.el)) continue;
      if (!already.has(l)) l._cacheGeometry(); // newly eligible mid-drag: measure it now
      next.push({ list: l, depth: l.depth });
    }
    this.dropCandidates = next;
    this.cachedLists = next.map((c) => c.list);
    this.syncDocumentListeners();
  }

  /**
   * Decide which list is under the pointer, switch if needed, then re-sort in the active one.
   *
   * The origin list is the one exception to "exiting a list resets/releases it": while the
   * pointer dives into one of the origin's OWN nested lists (at any depth), the origin's
   * placeholder and sibling displacement are left exactly as they are — frozen, not reset —
   * so returning to the origin's own level doesn't snap items back and then forward again.
   * Every OTHER (foreign) list still fully releases the moment the pointer leaves it, exactly
   * as before; nesting multiple foreign sessions alive at once would let their own internal
   * sibling displacement compound in ways a single flat `ancestorOffset` cannot represent.
   */
  private updateDropTarget(pointer: IPosition): void {
    const origin = this.originDropList;
    if (!origin) return;

    this.refreshDropCandidates(origin);
    const resolved = this.resolveDropList(pointer);
    const next = resolved?.list ?? null;
    const targetPointer = resolved?.pointer ?? pointer;
    if (next === this.activeDropList) {
      next?.sortItem(this, targetPointer);
      return;
    }

    const prev = this.activeDropList;
    if (prev && prev !== origin) prev.exit(this);

    const nextWithinOrigin = !!next && (next === origin || isDescendantOfList(next, origin));
    if (nextWithinOrigin) {
      if (prev === origin) origin._freeze(); // no longer the innermost, but stays engaged
    } else {
      origin.exit(this); // truly outside the origin's territory now: reset it (idempotent)
    }

    this.activeDropList = next;
    next?.enter(this, targetPointer.x, targetPointer.y); // coordinates belong to the target document
  }

  /**
   * Innermost connected list under the pointer, from the precomputed candidates: deeper always
   * beats shallower; among lists at the same depth (unrelated, visually overlapping lists) the
   * currently active one is kept to avoid flicker, otherwise the smaller one wins. No DOM
   * reads and no `.contains()` calls happen here — everything needed was precomputed above.
   */
  private resolveDropList(pointer: IPosition): { list: DropListRef<T>; pointer: IPosition } | null {
    let best: { list: DropListRef<T>; pointer: IPosition } | null = null;
    let bestDepth = -1;

    for (const { list, depth } of this.dropCandidates) {
      const targetDocument = list.el?.ownerDocument;
      if (!targetDocument) continue;

      // Pointer coordinates originate in the draggable's document. A same-origin iframe has
      // its own viewport coordinate space, so convert before testing its DropList geometry.
      const targetPoint = convertPointBetweenDocuments(
        pointer,
        this.el.ownerDocument,
        targetDocument,
      );
      if (!targetPoint || !list._containsPoint(targetPoint.x, targetPoint.y)) continue;

      if (!best || depth > bestDepth) {
        best = { list, pointer: targetPoint };
        bestDepth = depth;
      } else if (depth === bestDepth && best.list !== this.activeDropList) {
        if (list === this.activeDropList || list._area() < best.list._area()) {
          best = { list, pointer: targetPoint };
        }
      }
    }
    return best;
  }

  /**
   * Single teardown path for every way a drop-list drag can end (drop on a list, drop outside,
   * Escape, pointercancel, destroy). Everything transient is removed here, so nothing can leak
   * regardless of how the drag ended. Only then is the drop event emitted.
   */
  private finishListDrag(commit: boolean): void {
    for (const remove of this.documentListeners.values()) remove();
    this.documentListeners.clear();
    this.scrollListener = this.resizeListener = undefined;

    const target = commit ? this.activeDropList : null;
    const event = target?._finish(this, true) ?? null;
    for (const l of this.cachedLists) l._release(this);

    this.preview?.detach();
    this.preview = undefined;
    this.placeholder = undefined;
    this.activeDropList = null;
    this.cachedLists = [];
    this.dropCandidates = [];
    this.dropListsSnapshot = null;
    this.listDrag = false;

    // The source element is put back exactly as it was (its transform was never touched).
    this.el.classList.remove('ngx-draggable--dragging');
    this.el.style.visibility = this.sourceVisibility;
    this.el.style.display = this.sourceDisplay;
    this.el.style.pointerEvents = this.sourcePointerEvents;
    this.el.style.transition = this.sourceTransition;
    this.el.style.willChange = this.sourceWillChange;
    this.el.style.zIndex = this.previousZIndex;

    if (event && target) target.onDrop.emit(event);
  }

  private updatePreview(): void {
    if (!this.preview || !this.preview.element) return;

    // Preview is fixed in the source document's viewport coordinate space.
    this.preview.element.style.transform = `translate3d(${this.moveDx}px, ${this.moveDy}px, 0)`;
  }
}

/** Is `list` nested (at any depth) inside `ancestor`, per the parent/child list tree? */
function isDescendantOfList(list: DropListRef<any>, ancestor: DropListRef<any>): boolean {
  for (let p: DropListRef<any> | null = list.parentList; p; p = p.parentList) {
    if (p === ancestor) return true;
  }
  return false;
}

interface VisibleRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** The part of `el` that is actually on screen (clipped by scroll containers and the viewport). */
function visibleRect(el: HTMLElement): VisibleRect | null {
  const win = el.ownerDocument.defaultView;
  if (!win) return null;
  const r = el.getBoundingClientRect();
  let left = r.left;
  let top = r.top;
  let right = r.right;
  let bottom = r.bottom;
  for (let n = el.parentElement; n; n = n.parentElement) {
    const cs = win.getComputedStyle(n);
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
    const nr = n.getBoundingClientRect();
    left = Math.max(left, nr.left);
    top = Math.max(top, nr.top);
    right = Math.min(right, nr.right);
    bottom = Math.min(bottom, nr.bottom);
  }
  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, win.innerWidth);
  bottom = Math.min(bottom, win.innerHeight);
  if (right <= left || bottom <= top) return null;
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}
