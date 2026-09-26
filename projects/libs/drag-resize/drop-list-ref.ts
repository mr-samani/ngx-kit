import { EventEmitter } from '@angular/core';
import { IDropEvent } from './contracts/IDropEvent';
import { IPosition } from './contracts/IPosition';
import { DragRef } from './drag-ref';
import { DropListGroupRef } from './drop-list-group-ref';
import { PlaceHolderRef } from './placeholder-ref';
import {
  Box,
  Point,
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

  /**
   * Nesting: the nearest ENCLOSING drop list (null for a top-level list), and this list's own
   * direct nested lists — i.e. lists whose nearest enclosing list is this one, not a list at any
   * depth. Set by `NgxDropList` at init from a `skipSelf` DI lookup. Used for two things: (1)
   * `depth` for "innermost wins" in `DragRef`'s target resolution, without any DOM `.contains()`
   * calls on the hot path, and (2) cascading `_setAncestorOffset` (below) to every list nested
   * inside an item that gets displaced by sorting, at any depth.
   */
  parentList: DropListRef<any> | null = null;
  readonly childLists = new Set<DropListRef<any>>();

  private session: SortSession | null = null;
  private placeholder?: PlaceHolderRef;
  customPlaceholder?: PlaceHolderRef;
  private activeDrag: DragRef<T> | null = null;
  private isOrigin = false;
  private hovered = false;

  private hit: HitGeometry | null = null;
  /** Pre-insertion geometry of a foreign list, restored when the drag leaves it. */
  private naturalHit: HitGeometry | null = null;
  private hitCached = false;
  /**
   * Screen-space offset contributed by displaced ANCESTOR item(s) (see `parentList` above).
   * `{0,0}` outside of that (the overwhelmingly common case). Kept as a SUM of independent
   * per-source contributions, not a single overwritten value: while the pointer hovers a
   * FOREIGN (non-origin) list nested inside the origin's own displaced item, up to two ancestor
   * sessions can be displacing this list at once — the origin's (frozen, still active further
   * up) and that foreign list's own — and one clearing its contribution on release must not
   * wipe out the other's, still-active, contribution.
   */
  private readonly ancestorContributions = new Map<DropListRef<any>, Point>();
  private ancestorOffset: Point = { x: 0, y: 0 };
  /** Entries this list itself pushed via a one-time placeholder-insertion reflow (see below). */
  private readonly reflowContributions = new Map<HTMLElement, Point>();

  /** How many enclosing drop lists this one is nested inside. Root lists are depth 0. */
  get depth(): number {
    let d = 0;
    for (let p: DropListRef<any> | null = this.parentList; p; p = p.parentList) d++;
    return d;
  }

  _registerChild(child: DropListRef<any>): void {
    child.parentList = this;
    this.childLists.add(child);
  }

  _unregisterChild(child: DropListRef<any>): void {
    if (child.parentList === this) child.parentList = null;
    this.childLists.delete(child);
  }

  /**
   * One ancestor SESSION's contribution to this list's total displacement just changed (or
   * cleared, `{0,0}`). `source` identifies WHICH session — the list whose own item is doing the
   * displacing — so that this list's own recomputed total is a SUM across every currently-active
   * source, and cascades the SAME (source, offset) pair on to every nested list at any depth
   * unchanged, so a list several levels down stays hit-testable at its true on-screen position
   * regardless of which ancestor(s) are currently sorting.
   */
  _setAncestorOffset(source: DropListRef<any>, offset: Point): void {
    const prev = this.ancestorContributions.get(source);
    if (prev && prev.x === offset.x && prev.y === offset.y) return;
    if (offset.x === 0 && offset.y === 0) this.ancestorContributions.delete(source);
    else this.ancestorContributions.set(source, offset);

    let x = 0;
    let y = 0;
    for (const o of this.ancestorContributions.values()) {
      x += o.x;
      y += o.y;
    }
    if (x === this.ancestorOffset.x && y === this.ancestorOffset.y) return; // no net change
    this.ancestorOffset = { x, y };
    for (const child of this.childLists) child._setAncestorOffset(source, offset);
  }

  /** Which of this list's DIRECT nested lists live inside `el`, notified of its new offset. */
  private propagateOffset(el: HTMLElement, offset: Point): void {
    for (const child of this.childLists) {
      if (el.contains(child.el)) child._setAncestorOffset(this, offset);
    }
  }

  /** Rects, right now, of every `other` entry that contains one of this list's nested lists. */
  private trackedEntryRects(others: ReadonlySet<HTMLElement>): Map<HTMLElement, DOMRect> {
    const map = new Map<HTMLElement, DOMRect>();
    for (const child of this.childLists) {
      for (const el of others) {
        if (el.contains(child.el)) {
          if (!map.has(el)) map.set(el, el.getBoundingClientRect());
          break;
        }
      }
    }
    return map;
  }

  /** Turns the real reflow a fresh placeholder insertion just caused into ordinary offsets. */
  private propagateReflow(before: Map<HTMLElement, DOMRect>): void {
    for (const [el, prev] of before) {
      const now = el.getBoundingClientRect();
      const dx = now.left - prev.left;
      const dy = now.top - prev.top;
      if (dx || dy) {
        this.propagateOffset(el, { x: dx, y: dy });
        this.reflowContributions.set(el, { x: dx, y: dy });
      }
    }
  }

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

  /**
   * Measure the list and its clipping ancestors once, at drag start (or the moment a nested
   * list becomes a candidate mid-drag). `measureHit` reads live `getBoundingClientRect()`s,
   * which already include any `translate3d` an ancestor item's displacement has applied — so if
   * this list is currently offset (nested inside a sibling that sorting is displacing right
   * now), the measurement is normalized back to the zero-offset frame `_containsPoint` expects,
   * by subtracting that offset straight back out. Without this, entering a nested list while
   * its ancestor is mid-displacement would double-count the offset on every check afterwards.
   */
  _cacheGeometry(): void {
    const hit = measureHit(this.el);
    if (hit && (this.ancestorOffset.x || this.ancestorOffset.y)) {
      hit.box.left -= this.ancestorOffset.x;
      hit.box.right -= this.ancestorOffset.x;
      hit.box.top -= this.ancestorOffset.y;
      hit.box.bottom -= this.ancestorOffset.y;
    }
    this.hit = hit;
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
    // The list's own box shifts with any ancestor displacement; a clip window (a scroll/overflow
    // ancestor) normally does not, since it is not itself an item being sorted, so it is tested
    // against the raw pointer.
    const d0 = hit.frame.delta();
    if (!boxContains(hit.box, x - this.ancestorOffset.x + d0.x, y - this.ancestorOffset.y + d0.y))
      return false;
    for (const clip of hit.clips) {
      const d = clip.frame.delta();
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
      // Resuming a session that's still alive: either this is the origin list (its slot is
      // always kept), or the pointer dove into one of its own nested lists and came back up
      // (frozen rather than released in `exit()`, see there).
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
  /**
   * The pointer truly left this list (as opposed to moving deeper into one of its own nested
   * lists — see `DragRef`'s chain tracking, which never calls `exit()` for a list that remains
   * an ancestor of the new target, so this always means "left this list's territory").
   */
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
   * The pointer dove into one of this list's own nested lists: this list is no longer the
   * innermost target, but it isn't being left either — its placeholder and sibling displacement
   * stay exactly as they are (avoids a snap-back-then-forward flicker), only the "currently
   * hovered" bookkeeping (and its visual highlight) is cleared. `DragRef`'s chain tracking calls
   * this instead of `exit()` for every list that remains an ancestor of the new target.
   */
  _freeze(): void {
    this.hovered = false;
    this.el.classList.remove('ngx-drop-list--active');
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
    // `ancestorOffset` is deliberately NOT reset here: `enter()` calls this unconditionally as a
    // safety-clear on every (re-)entry, including while a currently-active ancestor transform
    // still legitimately applies to this list. It self-corrects when that transform actually
    // reverts to zero, via the `onOffsetChange` cascade (see `_setAncestorOffset`), which also
    // covers the true end of a drag (the displaced list's own session disposes and reports
    // every entry back to `{0,0}`).
  }

  /** Dispose the sort session, placeholder and drag ownership. */
  private releaseSession(drag?: DragRef<T>): void {
    if (drag && this.activeDrag && this.activeDrag !== drag) return;

    this.session?.dispose();
    this.session = null;
    if (this.reflowContributions.size) {
      // The one-time reflow from this list's own placeholder insertion (see `propagateReflow`)
      // never went through the session's own `applied` map, so its `dispose()` above cannot
      // have cleared it — do that here instead, or it would linger as a stale contribution.
      for (const [el] of this.reflowContributions) this.propagateOffset(el, { x: 0, y: 0 });
      this.reflowContributions.clear();
    }

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

    const ph = this.customPlaceholder ?? new PlaceHolderRef();

    ph.dropList = this;
    let spacer: Text | null | undefined;

    if (origin) {
      // The placeholder takes over the exact slot of the (now hidden) source element.
      ph.attach(this.el, drag.el, drag.el);
      this.lockPlaceholderGeometry(drag, ph, drag.start);
    } else {
      ph.detach();
      // Only the "other" entries that contain a nested list are worth measuring (usually none,
      // or very few, even in a large tree): inserting the placeholder is a REAL DOM node, so it
      // shifts later siblings via ordinary CSS reflow, not `translate3d` — a one-time event this
      // list's own SortSession never reports through `onOffsetChange`, since (being sized and
      // positioned by `foreignInsertionReference` to already match where it belongs) it never
      // needs to actually transform anything afterwards. Measuring the small tracked set just
      // before and after the insertion turns that one-time reflow into an ordinary ancestor
      // contribution, exactly like any other displaced entry.
      const tracked = this.childLists.size ? this.trackedEntryRects(others) : null;
      const reference = this.foreignInsertionReference(others, pointer, axis, rtl);
      ph.attach(this.el, drag.el, reference);
      // Sized to its final footprint BEFORE measuring the reflow it causes: an unsized clone
      // (still near-zero height) wouldn't have pushed `others` at all yet.
      this.lockPlaceholderGeometry(drag, ph, drag.start);
      if (tracked) this.propagateReflow(tracked);
      spacer = makeSpacer(this.el);
      if (spacer) this.el.insertBefore(spacer, reference ?? ph.element!);
    }

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
      onOffsetChange: this.childLists.size
        ? (el, offset) => this.propagateOffset(el, offset)
        : undefined,
    });

    if (!origin && this.hitCached) {
      // Inserting the placeholder made this list bigger; the grown box is what the user sees
      // (and must be able to reach, e.g. to append below the last item). The natural box comes
      // back on exit, so entering/leaving at the old edge cannot flicker.
      this.naturalHit = this.hit;
      this._cacheGeometry();
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

  private lockPlaceholderGeometry(drag: DragRef<T>, ph: PlaceHolderRef, rect: DOMRect): void {
    const placeholder = ph.element!;
    const set = (k: string, v: string) => placeholder.style.setProperty(k, v, 'important');

    placeholder.style.zIndex = '';
    placeholder.style.removeProperty('will-change');

    if (ph.custom) return;

    placeholder.style.display = drag.originalDisplay;

    // Occupies exactly the dragged item's footprint, so the gap reserved in the list — and the
    // sibling-displacement math derived from it — matches the item's real size.
    set('width', `${rect.width}px`);
    set('height', `${rect.height}px`);
    // set('min-width', `${rect.width}px`);
    // set('min-height', `${rect.height}px`);
    // set('max-width', `${rect.width}px`);
    // set('max-height', `${rect.height}px`);
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
