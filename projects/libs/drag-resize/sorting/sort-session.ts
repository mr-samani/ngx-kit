import { ScrollFrame } from '../utils/scroll-frame';
import {
  Axis,
  Box,
  LayoutModel,
  Point,
  analyzeLayout,
  computeAxisOffsets,
  resolveInsertionIndex,
  toBox,
} from './layout-geometry';

export interface SortSessionInit {
  /** The drop list element. */
  container: HTMLElement;
  /** The placeholder for the dragged item. Must already be attached inside `container`. */
  placeholder: HTMLElement;
  /** Slot elements (direct children of `container`) of every draggable EXCEPT the dragged one. */
  itemElements: ReadonlySet<HTMLElement>;
  /** Used only while the list is too small to reveal its own orientation. */
  fallbackAxis: 'x' | 'y';
  fallbackRtl: boolean;
  /** Sibling animation in ms (0 disables). */
  animationMs: number;
  /** Whitespace separator already inserted next to the placeholder (inline layouts only). */
  spacer?: Text | null;
  /**
   * Notified whenever an entry's `translate3d` offset changes (including back to `{0,0}`).
   * A displaced item can contain OTHER registered drop lists (a tree of nested lists); their
   * cached hit-test geometry was measured before any displacement, so without this hook their
   * on-screen position and their hit-test box silently disagree once a sibling moves.
   */
  onOffsetChange?: (el: HTMLElement, offset: Point) => void;
}

/**
 * Inline / inline-block layouts get their inter-item gap from whitespace TEXT nodes. A
 * placeholder that is moved (or freshly inserted) without one would collapse that gap and shift
 * everything after it by a space width, so it carries a separator of its own. Returns `null`
 * for layouts that have no whitespace nodes (flex, grid, Angular-trimmed templates).
 */
export function makeSpacer(container: HTMLElement): Text | null {
  for (const n of Array.from(container.childNodes)) {
    if (n.nodeType === Node.TEXT_NODE && n.nodeValue && /^\s+$/.test(n.nodeValue)) {
      return container.ownerDocument.createTextNode(n.nodeValue);
    }
  }
  return null;
}

interface Entry {
  el: HTMLElement;
  isSlot: boolean;
  /** Computed transform the element had before we touched it (so e.g. rotations survive). */
  base: string;
  savedTransform: string;
  savedTransition: string;
  savedWillChange: string;
}

const EASING = 'cubic-bezier(0, 0, 0.2, 1)';

/**
 * One drag's view of one drop list.
 *
 * Lifecycle
 * ---------
 *   snapshot ──► resolve(pointer) ──► apply(index) ──► ... ──► dispose()
 *
 * The snapshot (`boxes`) is taken once, with the dragged item's slot already in place, and is
 * never re-read while the drag is over the list. `resolve` is a pure function of the pointer
 * and that snapshot, so moving the pointer back always restores the previous state.
 *
 * Two ways to *show* the result, chosen from the measured layout:
 *
 *  - `transform` (one row or one column; the common case): the DOM is never touched. Siblings
 *    and the placeholder are displaced with `translate3d`, computed from measured sizes and
 *    gaps, exactly like Angular CDK's single-axis strategy.
 *  - `flow` (grid / wrapping layouts): an exact translate cannot be derived without
 *    re-implementing the browser's layout engine, so the single placeholder node is moved and
 *    the browser lays the list out. Siblings are then animated from their old to new position
 *    with FLIP `translate3d` so the motion is still transform-driven and smooth. Decisions
 *    keep using the immutable snapshot, so the reflow can never feed back into them.
 */
export class SortSession {
  readonly mode: 'transform' | 'flow';

  private readonly container: HTMLElement;
  private readonly placeholder: HTMLElement;
  private readonly itemElements: ReadonlySet<HTMLElement>;
  private readonly animationMs: number;
  private readonly fallbackAxis: 'x' | 'y';
  private readonly fallbackRtl: boolean;

  private entries: Entry[] = [];
  private boxes: Box[] = [];
  private model!: LayoutModel;
  /** Index of the slot (placeholder) inside `entries`/`boxes` at snapshot time. */
  private slotIdx = -1;
  /** For each visible "other" item: its index among ALL other items (hidden ones included). */
  private otherModelIndex: number[] = [];
  private frame: ScrollFrame;
  private applied = new Map<HTMLElement, Point>();
  private targetIdx = 0;
  private disposed = false;
  /** undefined = not created yet, null = this layout has no whitespace separators. */
  private spacer: Text | null | undefined;
  private readonly onOffsetChange?: (el: HTMLElement, offset: Point) => void;

  constructor(init: SortSessionInit) {
    this.spacer = init.spacer;
    this.onOffsetChange = init.onOffsetChange;
    this.container = init.container;
    this.placeholder = init.placeholder;
    this.itemElements = init.itemElements;
    this.animationMs = init.animationMs;
    this.fallbackAxis = init.fallbackAxis;
    this.fallbackRtl = init.fallbackRtl;

    this.snapshot();
    this.frame = new ScrollFrame(this.container, true);
    this.mode = this.model.axis === 'grid' ? 'flow' : 'transform';
    this.targetIdx = this.slotIdx;

    const transition = this.animationMs > 0 ? `transform ${this.animationMs}ms ${EASING}` : '';
    for (const e of this.entries) {
      e.el.style.willChange = 'transform';
      if (transition) e.el.style.transition = transition;
    }
  }

  /** Detected orientation (useful for tests/diagnostics). */
  get axis(): Axis {
    return this.model.axis;
  }

  /** Current insertion index among the *visible other* items. */
  get target(): number {
    return this.targetIdx;
  }

  /** Index at which the session started (the slot's original position). */
  get origin(): number {
    return this.slotIdx;
  }

  /** Insertion index among ALL other items of the list (what consumers see as `currentIndex`). */
  get modelIndex(): number {
    const idx = this.otherModelIndex;
    if (this.targetIdx < idx.length) return idx[this.targetIdx];
    return idx.length ? idx[idx.length - 1] + 1 : 0;
  }

  /** Where would the dragged item be inserted if released at `pointer`? Pure; no side effects. */
  resolve(pointer: Point): number {
    const d = this.frame.delta();
    return resolveInsertionIndex(
      this.model,
      this.boxes,
      this.slotIdx,
      { x: pointer.x + d.x, y: pointer.y + d.y },
      this.targetIdx,
    );
  }

  /** Visually place the slot at `index`. Idempotent. */
  apply(index: number): void {
    if (this.disposed || index === this.targetIdx) return;
    this.targetIdx = index;
    if (this.mode === 'transform') this.applyTransforms(index);
    else this.applyFlow(index);
  }

  /** Put everything back where it started (slot at its original index). */
  reset(): void {
    this.apply(this.slotIdx);
  }

  /** A scroll event happened somewhere: cached scroll deltas must be re-read once. */
  onScroll(): void {
    this.frame.invalidate();
  }

  /**
   * Re-baseline from the live layout (e.g. the window was resized mid-drag). Not called during
   * normal sorting, because re-measuring while items are displaced is exactly what would
   * re-introduce feedback into the decision.
   */
  refresh(): void {
    if (this.disposed) return;
    const target = this.targetIdx;
    this.clearDisplacement();
    this.snapshot();
    this.frame = new ScrollFrame(this.container, true);
    if (this.mode === 'transform') {
      this.targetIdx = this.slotIdx;
      this.apply(Math.min(target, this.boxes.length - 1));
    } else {
      this.targetIdx = this.slotIdx;
    }
  }

  /** Restore every inline style this session touched. Safe to call more than once. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const e of this.entries) {
      e.el.style.transform = e.savedTransform;
      e.el.style.transition = e.savedTransition;
      e.el.style.willChange = e.savedWillChange;
      if (this.applied.has(e.el)) this.onOffsetChange?.(e.el, { x: 0, y: 0 });
    }
    this.applied.clear();
    this.spacer?.remove();
  }

  // ---------------------------------------------------------------------------------------
  // snapshot
  // ---------------------------------------------------------------------------------------

  private snapshot(): void {
    const previous = new Map(this.entries.map((e) => [e.el, e] as const));

    const entries: Entry[] = [];
    const boxes: Box[] = [];
    const otherModelIndex: number[] = [];
    let slot = -1;
    let allOthers = 0;

    for (const node of Array.from(this.container.children)) {
      if (!(node instanceof HTMLElement)) continue;
      const isSlot = node === this.placeholder;
      if (!isSlot && !this.itemElements.has(node)) continue;

      const modelIdx = isSlot ? -1 : allOthers++;
      const rect = node.getBoundingClientRect();
      const off = this.applied.get(node);
      const box = toBox(rect);
      if (off) {
        // Strip our own displacement so the snapshot always describes the *undisplaced* layout.
        box.left -= off.x;
        box.right -= off.x;
        box.top -= off.y;
        box.bottom -= off.y;
      }
      const hidden = !isSlot && rect.width === 0 && rect.height === 0;
      if (hidden) continue;

      if (isSlot) slot = entries.length;
      else otherModelIndex.push(modelIdx);

      const known = previous.get(node);
      entries.push(
        known ?? {
          el: node,
          isSlot,
          base: initialTransform(node),
          savedTransform: node.style.transform,
          savedTransition: node.style.transition,
          savedWillChange: node.style.willChange,
        },
      );
      boxes.push(box);
    }

    this.entries = entries;
    this.boxes = boxes;
    this.slotIdx = slot;
    this.otherModelIndex = otherModelIndex;
    this.model = analyzeLayout(boxes, this.fallbackAxis, this.fallbackRtl);
  }

  // ---------------------------------------------------------------------------------------
  // transform strategy (DOM stays untouched)
  // ---------------------------------------------------------------------------------------

  private applyTransforms(target: number): void {
    const offsets = computeAxisOffsets(this.model, this.boxes, this.slotIdx, target);
    const horizontal = this.model.axis === 'x';
    this.entries.forEach((e, i) => {
      const o = offsets[i];
      this.setOffset(e, horizontal ? { x: o, y: 0 } : { x: 0, y: o });
    });
  }

  private setOffset(e: Entry, off: Point): void {
    const prev = this.applied.get(e.el);
    if ((prev?.x ?? 0) === off.x && (prev?.y ?? 0) === off.y) return;
    if (off.x === 0 && off.y === 0) {
      this.applied.delete(e.el);
      e.el.style.transform = e.savedTransform;
    } else {
      this.applied.set(e.el, off);
      e.el.style.transform = `translate3d(${off.x}px, ${off.y}px, 0)${e.base}`;
    }
    this.onOffsetChange?.(e.el, off);
  }

  // ---------------------------------------------------------------------------------------
  // flow strategy (single placeholder move + FLIP transforms)
  // ---------------------------------------------------------------------------------------

  private applyFlow(target: number): void {
    const entries = this.entries;

    // 1. READ: where everything visually is right now (including in-flight animations).
    const first = entries.map((e) => e.el.getBoundingClientRect());

    // 2. WRITE: move the one placeholder node; drop any FLIP transforms.
    this.placeAt(target);
    for (const e of entries) {
      e.el.style.transition = 'none';
      e.el.style.transform = e.savedTransform;
    }

    // 3. READ: where everything is after the browser re-flowed the list.
    const last = entries.map((e) => e.el.getBoundingClientRect());

    // 4. WRITE: invert (put each item back where it was), then play (animate to its new home).
    const moved: Entry[] = [];
    entries.forEach((e, i) => {
      const dx = first[i].left - last[i].left;
      const dy = first[i].top - last[i].top;
      if (this.animationMs > 0 && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        e.el.style.transform = `translate3d(${dx}px, ${dy}px, 0)${e.base}`;
        moved.push(e);
      }
    });

    const transition = this.animationMs > 0 ? `transform ${this.animationMs}ms ${EASING}` : '';
    if (moved.length) void this.container.offsetWidth; // commit the inverted frame
    for (const e of entries) e.el.style.transition = transition || e.savedTransition;
    for (const e of moved) e.el.style.transform = e.savedTransform;
  }

  private placeAt(target: number): void {
    const container = this.container;
    if (this.spacer === undefined) this.spacer = makeSpacer(container);
    const spacer = this.spacer;
    spacer?.remove();

    const others = this.entries.filter((e) => !e.isSlot);
    const ref = others[target]?.el;
    if (ref) {
      // ... [placeholder][separator][ref]: the separator that used to sit before `ref` still
      // separates it from its previous sibling, the new one separates it from the placeholder.
      container.insertBefore(this.placeholder, ref);
      if (spacer) container.insertBefore(spacer, ref);
      return;
    }
    const last = others[others.length - 1]?.el;
    const after = last ? last.nextSibling : null;
    if (spacer) container.insertBefore(spacer, after);
    container.insertBefore(this.placeholder, after);
  }

  private clearDisplacement(): void {
    for (const e of this.entries) {
      e.el.style.transition = 'none';
      e.el.style.transform = e.savedTransform;
      if (this.applied.has(e.el)) this.onOffsetChange?.(e.el, { x: 0, y: 0 });
    }
    this.applied.clear();
  }
}

function initialTransform(el: HTMLElement): string {
  const t = getComputedStyle(el).transform;
  return t && t !== 'none' ? ` ${t}` : '';
}
