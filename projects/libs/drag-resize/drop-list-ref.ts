import { EventEmitter } from '@angular/core';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { PlaceHolderRef } from './placeholder-ref';
import {
  Box,
  analyzeLayout,
  boxContains,
  resolveInsertionIndex,
  toBox,
} from './sorting/layout-geometry';
import { SortSession, makeSpacer } from './sorting/sort-session';
import { isRtl } from './utils/rtl';
import { ScrollFrame } from './utils/scroll-frame';

/**
 * A drop list.
 *
 * Membership (`_draggables`) only ever reflects which draggables *belong* to this list in the
 * template. It is never changed by dragging. Everything that is transient during a drag lives
 * in a single `SortSession` (see sorting/sort-session.ts) that is created when a drag enters
 * the list and disposed when it leaves or the drag ends:
 *
 *  - the list the drag started in keeps its session for the whole drag (its placeholder holds
 *    the item's original slot, so leaving and re-entering is stable);
 *  - any other list gets a fresh session on every entry and drops it on every exit.
 */
export class DropListRef<T = any> {
  data?: T;
  el!: HTMLElement;
  disableSort = false;
  connectedTo: HTMLElement[] = [];
  dropListGroup?: DropListGroupRef | null;
  /** Duration (ms) of the sibling slide animation. `0` disables animation. */
  sortAnimationDuration = 200;

  readonly _draggables = new Set<DragRef<T>>();
  readonly onDrop = new EventEmitter<IDropEvent<T>>();

  private session: SortSession | null = null;
  private placeholder?: PlaceHolderRef;
  private activeDrag: DragRef<T> | null = null;
  private isOrigin = false;
  private hovered = false;

  private hit: HitGeometry | null = null;
  /** Pre-insertion geometry of a foreign list, restored when the drag leaves it. */
  private naturalHit: HitGeometry | null = null;
  private hitCached = false;

  addItem(item: DragRef<T>): void {
    this._draggables.add(item);
  }

  removeItem(item: DragRef<T>): void {
    this._draggables.delete(item);
  }

  isConnectedTo(other: DropListRef<any>): boolean {
    if (other === this) return true;
    if (this.connectedTo.includes(other.el) || other.connectedTo.includes(this.el)) return true;
    return !!this.dropListGroup && this.dropListGroup.has(other);
  }

  // ---------------------------------------------------------------------------------------
  // hit testing (cached for the duration of a drag)
  // ---------------------------------------------------------------------------------------

  /** Measure the list and its clipping ancestors once, at drag start. */
  _cacheGeometry(): void {
    this.hit = measureHit(this.el);
    this.hitCached = true;
  }

  /**
   * Is the point over the *visible* part of this list? Scroll-aware without re-measuring.
   *
   * The list box and every clipping ancestor are tracked separately because they react to scroll
   * differently: scrolling a container moves the list but not the container's own clip window.
   */
  _containsPoint(x: number, y: number): boolean {
    const hit = this.hitCached ? this.hit : measureHit(this.el);
    if (!hit) return false;
    let d = hit.frame.delta();
    if (!boxContains(hit.box, x + d.x, y + d.y)) return false;
    for (const clip of hit.clips) {
      d = clip.frame.delta();
      if (!boxContains(clip.box, x + d.x, y + d.y)) return false;
    }
    return true;
  }

  /** Approximate area, used to break ties between overlapping, unrelated lists. */
  _area(): number {
    const b = (this.hit ?? measureHit(this.el))?.box;
    return b ? (b.right - b.left) * (b.bottom - b.top) : 0;
  }

  _onScroll(): void {
    this.hit?.frame.invalidate();
    this.hit?.clips.forEach((c) => c.frame.invalidate());
    this.session?.onScroll();
  }

  /** Re-measure after a viewport resize. */
  _refresh(): void {
    if (this.hitCached) this._cacheGeometry();
    this.session?.refresh();
  }

  // ---------------------------------------------------------------------------------------
  // drag lifecycle
  // ---------------------------------------------------------------------------------------

  /** Backwards-compatible entry point: makes this list the drag's target. */
  createPlaceholder(drag: DragRef<T>): PlaceHolderRef {
    this.enter(drag, drag.pointer.x, drag.pointer.y);
    return drag.placeholder!;
  }

  /** The drag pointer entered this list (or the drag started inside it). */
  enter(drag: DragRef<T>, x = 0, y = 0): void {
    if (this.session && this.activeDrag === drag) {
      // Re-entering the list the drag started in: its session (and slot) are still alive.
      this.hovered = true;
      this.el.classList.add('ngx-drop-list--active');
      drag.placeholder = this.placeholder;
      this.sortItem(drag, { x, y });
      return;
    }

    this.releaseSession(); // never keep stale state from a previous drag (geometry cache stays)
    this.begin(drag, { x, y });
    this.hovered = true;
    this.el.classList.add('ngx-drop-list--active');
  }

  /** Re-evaluate the insertion index for the pointer. Returns the new index, or null if unchanged. */
  sortItem(drag: DragRef<T>, position: IPosition): number | null {
    const s = this.session;
    if (!s || this.activeDrag !== drag || !this.hovered || this.disableSort) return null;

    const next = s.resolve(position);
    if (next === s.target) return null;
    s.apply(next);
    return s.modelIndex;
  }

  /** The pointer left this list. */
  exit(drag: DragRef<T>): void {
    if (!this.session || this.activeDrag !== drag) return;
    this.hovered = false;
    this.el.classList.remove('ngx-drop-list--active');

    if (this.isOrigin) {
      // Keep the original slot (the item logically still lives here) but stop displacing siblings.
      this.session.reset();
    } else {
      // A foreign list forgets the drag on exit; its geometry stays cached until the drag ends.
      this.releaseSession(drag);
    }
  }

  /**
   * Ends the drag for this list. Returns the drop event when the pointer was released over this
   * list, `null` otherwise (nothing to emit). All transient state is disposed either way.
   */
  _finish(drag: DragRef<T>, commit: boolean): IDropEvent<T> | null {
    const s = this.session;
    if (!s || this.activeDrag !== drag) return null;

    const event: IDropEvent<T> | null =
      commit && this.hovered
        ? {
            previousIndex: Math.max(0, drag.originIndex),
            currentIndex: s.modelIndex,
            item: drag,
            container: this,
            previousContainer: drag.originDropList ?? this,
            isPointerOverContainer: true,
          }
        : null;

    this.releaseSession(drag);
    return event;
  }

  /** Compatibility wrapper: finish + emit. */
  finishDrag(drag: DragRef<T>): void {
    const event = this._finish(drag, true);
    if (event) this.onDrop.emit(event);
  }

  resetSortTransforms(): void {
    this.session?.reset();
  }

  getFinalIndex(): number {
    return this.session ? this.session.modelIndex : 0;
  }

  getItemIndex(item: DragRef<T>): number {
    return this.indexOf(item);
  }

  /** End of the drag: dispose EVERYTHING this list holds, including cached geometry. Idempotent. */
  _release(drag?: DragRef<T>): void {
    if (drag && this.activeDrag && this.activeDrag !== drag) return;
    this.releaseSession(drag);
    this.hit = null;
    this.hitCached = false;
  }

  /** Dispose the sort session, placeholder and drag ownership. */
  private releaseSession(drag?: DragRef<T>): void {
    if (drag && this.activeDrag && this.activeDrag !== drag) return;

    this.session?.dispose();
    this.session = null;

    this.placeholder?.detach();
    if (this.activeDrag && this.activeDrag.placeholder === this.placeholder) {
      this.activeDrag.placeholder = undefined;
    }
    this.placeholder = undefined;

    if (this.naturalHit) {
      this.hit = this.naturalHit;
      this.naturalHit = null;
    }

    this.activeDrag = null;
    this.isOrigin = false;
    this.hovered = false;
    this.el?.classList.remove('ngx-drop-list--active');
  }

  // ---------------------------------------------------------------------------------------
  // internals
  // ---------------------------------------------------------------------------------------

  private begin(drag: DragRef<T>, pointer: IPosition): void {
    const origin = drag.originDropList === this;
    const others = this.otherSlots(drag);
    const rtl = isRtl(this.el);
    const axis = fallbackAxis(this.el);

    const ph = new PlaceHolderRef();
    ph.dropList = this;
    let spacer: Text | null | undefined;

    if (origin) {
      // The placeholder takes over the exact slot of the (now hidden) source element.
      ph.attach(this.el, drag.el, drag.el);
    } else {
      const reference = this.foreignInsertionReference(others, pointer, axis, rtl);
      ph.attach(this.el, drag.el, reference);
      spacer = makeSpacer(this.el);
      if (spacer) this.el.insertBefore(spacer, reference ?? ph.element!);
    }
    this.lockPlaceholderGeometry(drag, ph.element!, drag.start);

    this.placeholder = ph;
    this.activeDrag = drag;
    this.isOrigin = origin;
    drag.placeholder = ph;

    this.session = new SortSession({
      container: this.el,
      placeholder: ph.element!,
      itemElements: others,
      fallbackAxis: axis,
      fallbackRtl: rtl,
      animationMs: this.sortAnimationDuration,
      spacer,
    });

    if (!origin && this.hitCached) {
      // Inserting the placeholder made this list bigger; the grown box is what the user sees
      // (and must be able to reach, e.g. to append below the last item). The natural box comes
      // back on exit, so entering/leaving at the old edge cannot flicker.
      this.naturalHit = this.hit;
      this.hit = measureHit(this.el);
    }
  }

  /**
   * First placement into a list that does not contain the item yet: the node the placeholder
   * must be inserted before (null = append). Same pure resolver as sorting, no hysteresis.
   */
  private foreignInsertionReference(
    others: ReadonlySet<HTMLElement>,
    pointer: IPosition,
    axis: 'x' | 'y',
    rtl: boolean,
  ): Node | null {
    const els: HTMLElement[] = [];
    const boxes: Box[] = [];
    for (const node of Array.from(this.el.children)) {
      if (!(node instanceof HTMLElement) || !others.has(node)) continue;
      const r = node.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      els.push(node);
      boxes.push(toBox(r));
    }
    if (!els.length) return null;

    const index = this.disableSort
      ? els.length
      : resolveInsertionIndex(analyzeLayout(boxes, axis, rtl), boxes, -1, pointer, null);

    return index < els.length ? els[index] : els[els.length - 1].nextSibling;
  }

  private otherSlots(drag: DragRef<T>): Set<HTMLElement> {
    const set = new Set<HTMLElement>();
    for (const d of this._draggables) {
      if (d !== drag && d.el?.parentElement === this.el) set.add(d.el);
    }
    return set;
  }

  private indexOf(item: DragRef<T>): number {
    const byElement = new Map<HTMLElement, DragRef<T>>();
    for (const d of this._draggables) if (d.el) byElement.set(d.el, d);

    let index = 0;
    for (const node of Array.from(this.el.children)) {
      if (!(node instanceof HTMLElement)) continue;
      if (node === this.placeholder?.element) continue;
      if (node.classList.contains('ngx-drag-placeholder')) continue;
      if (node.classList.contains('ngx-drag-preview')) continue;
      const ref = byElement.get(node);
      if (!ref) continue;
      if (ref === item) return index;
      index++;
    }
    return -1;
  }

  private lockPlaceholderGeometry(drag: DragRef<T>, placeholder: HTMLElement, rect: DOMRect): void {
    const set = (k: string, v: string) => placeholder.style.setProperty(k, v, 'important');

    // The clone was taken from the source, which may already carry drag-time inline styles.
    placeholder.style.display = drag.originalDisplay;
    placeholder.style.zIndex = '';
    placeholder.style.removeProperty('will-change');

    set('width', `${rect.width}px`);
    set('height', `${rect.height}px`);
    set('min-width', `${rect.width}px`);
    set('min-height', `${rect.height}px`);
    set('max-width', `${rect.width}px`);
    set('max-height', `${rect.height}px`);
    set('visibility', 'visible');
    set('opacity', '0.16');
    set('pointer-events', 'none');
    set('animation', 'none');
    set('box-sizing', 'border-box');
  }
}

/** Orientation to assume while a list has fewer than two items to measure. */
function fallbackAxis(container: HTMLElement): 'x' | 'y' {
  const s = getComputedStyle(container);
  if (s.display.includes('flex')) return s.flexDirection.startsWith('column') ? 'y' : 'x';
  if (s.display.includes('grid')) return 'y';
  const child = container.firstElementChild;
  if (child && getComputedStyle(child).display.startsWith('inline')) return 'x';
  return 'y';
}

interface HitGeometry {
  box: Box;
  frame: ScrollFrame;
  clips: { box: Box; frame: ScrollFrame }[];
}

/** Rect of the list plus one clip window per clipping (overflow != visible) ancestor. */
function measureHit(el: HTMLElement): HitGeometry | null {
  const r = el.getBoundingClientRect();
  if (r.right <= r.left || r.bottom <= r.top) return null;

  const clips: HitGeometry['clips'] = [];
  const root = el.ownerDocument.documentElement;
  for (let node = el.parentElement; node && node !== root; node = node.parentElement) {
    const s = getComputedStyle(node);
    const cx = s.overflowX !== 'visible';
    const cy = s.overflowY !== 'visible';
    if (!cx && !cy) continue;
    const c = node.getBoundingClientRect();
    clips.push({
      box: {
        left: cx ? c.left : -Infinity,
        right: cx ? c.right : Infinity,
        top: cy ? c.top : -Infinity,
        bottom: cy ? c.bottom : Infinity,
      },
      // A clip window only moves when something ABOVE the clipping element scrolls.
      frame: new ScrollFrame(node, false),
    });
  }
  return { box: toBox(r), frame: new ScrollFrame(el, false), clips };
}
