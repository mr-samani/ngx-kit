import { DragRef } from '../drag-ref';
import { isRtl } from '../utils/rtl';
import { SortResult } from './sort-strategy';

type Flow = 'grid' | 'flex-row' | 'flex-column' | 'free';

interface ItemGeometry {
  drag: DragRef;
  rect: DOMRect;
  domIndex: number;
}

/**
 * Live geometry sorting.
 *
 * Unlike the old snapshot-only implementation, every sort pass reads the
 * current DOM order and current client rects. This matters when:
 *  - the placeholder changes layout,
 *  - a Kanban column is scrolled while dragging,
 *  - the dragged item enters another list,
 *  - CSS grid/flex reflows occur.
 */
export class PositionalSortStrategy {
  private container!: HTMLElement;
  private dragging: DragRef | null = null;
  private index = -1;
  private flow: Flow = 'free';
  private rtl = false;

  withElementContainer(el: HTMLElement): this {
    this.container = el;
    return this;
  }

  start(_items: readonly DragRef<any>[]): void {
    this.flow = detectFlow(this.container);
    this.rtl = isRtl(this.container);
    this.index = -1;
  }

  enter(drag: DragRef<any>, x: number, y: number): void {
    this.dragging = drag;
    this.index = this.findInsertionIndex(drag, x, y);
    this.movePlaceholder(drag, this.index);
  }

  sort(drag: DragRef<any>, x: number, y: number): SortResult | null {
    this.dragging = drag;

    const next = this.findInsertionIndex(drag, x, y);
    const previous = this.getCurrentIndex();

    if (next === previous) return null;

    this.movePlaceholder(drag, next);

    return {
      previousIndex: previous,
      currentIndex: next,
    };
  }

  getCurrentIndex(): number {
    if (!this.container) return Math.max(0, this.index);

    const placeholder = this.dragging?.getPlaceholderElement();
    if (placeholder?.parentElement === this.container) {
      const refs = new Set(this.container.__ngxDragItems ?? []);
      let position = 0;

      const itemElements = new Set(Array.from(refs, (item) => item.el));

      for (const node of Array.from(this.container.children)) {
        if (node === placeholder) return position;

        if (
          node instanceof HTMLElement &&
          itemElements.has(node) &&
          node !== this.dragging?.el
        ) {
          position++;
        }
      }
    }

    return Math.max(0, this.index);
  }

  getItemIndex(item: DragRef): number {
    let index = 0;
    const refs = new Set(this.container.__ngxDragItems ?? []);

    const itemElements = new Set(Array.from(refs, (ref) => ref.el));

    for (const node of Array.from(this.container.children)) {
      if (node === item.el) return index;

      if (
        node instanceof HTMLElement &&
        !node.classList.contains('ngx-drag-placeholder') &&
        !node.classList.contains('ngx-drag-in-body') &&
        (!refs.size || itemElements.has(node))
      ) {
        index++;
      }
    }

    return -1;
  }

  reset(): void {
    this.dragging = null;
    this.index = -1;
  }

  private movePlaceholder(drag: DragRef, index: number): void {
    const ph = drag.getPlaceholderElement();
    if (!ph || !this.container) return;

    const items = this.readItems(drag);
    const reference = items[index]?.drag.el ?? null;

    if (reference) {
      if (ph !== reference.previousSibling) {
        this.container.insertBefore(ph, reference);
      }
    } else if (ph.parentElement !== this.container || ph !== this.container.lastElementChild) {
      this.container.appendChild(ph);
    }

    this.index = Math.max(0, Math.min(index, items.length));
  }

  private findInsertionIndex(drag: DragRef, x: number, y: number): number {
    const items = this.readItems(drag);
    if (!items.length) return 0;

    switch (this.flow) {
      case 'flex-row':
        return this.findFlexRow(items, x);
      case 'flex-column':
        return this.findFlexColumn(items, y);
      case 'grid':
      case 'free':
      default:
        return this.findGrid(items, x, y);
    }
  }

  private readItems(drag: DragRef): ItemGeometry[] {
    const itemSet = new Set<DragRef>(
      // DropListRef maintains the authoritative set; DOM order is authoritative
      // for placement, so we only inspect direct children here.
      this.container.__ngxDragItems ?? [],
    );
    const byElement = new Map<HTMLElement, DragRef>(
      Array.from(itemSet, (item) => [item.el, item] as const),
    );

    const result: ItemGeometry[] = [];

    Array.from(this.container.children).forEach((element, domIndex) => {
      if (
        !(element instanceof HTMLElement) ||
        element === drag.el ||
        element.classList.contains('ngx-drag-placeholder') ||
        element.classList.contains('ngx-drag-in-body')
      ) {
        return;
      }

      const ref = byElement.get(element);
      if (!ref) return;

      result.push({
        drag: ref,
        rect: element.getBoundingClientRect(),
        domIndex,
      });
    });

    // Fallback for environments where the private bridge is not available.
    if (!result.length) {
      return [];
    }

    return result;
  }

  private findFlexRow(items: ItemGeometry[], x: number): number {
    for (let i = 0; i < items.length; i++) {
      const r = items[i].rect;
      const mid = r.left + r.width / 2;
      const before = this.rtl ? x > mid : x < mid;
      if (before) return i;
    }
    return items.length;
  }

  private findFlexColumn(items: ItemGeometry[], y: number): number {
    for (let i = 0; i < items.length; i++) {
      const r = items[i].rect;
      if (y < r.top + r.height / 2) return i;
    }
    return items.length;
  }

  private findGrid(items: ItemGeometry[], x: number, y: number): number {
    let best = items[0];
    let bestScore = Number.POSITIVE_INFINITY;

    for (const item of items) {
      const cx = item.rect.left + item.rect.width / 2;
      const cy = item.rect.top + item.rect.height / 2;
      const dx = Math.abs(x - cx) / Math.max(item.rect.width, 1);
      const dy = Math.abs(y - cy) / Math.max(item.rect.height, 1);
      const score = dx + dy * 1.2;
      if (score < bestScore) {
        bestScore = score;
        best = item;
      }
    }

    const target = best.rect;
    const sameRow =
      y >= target.top - target.height * 0.35 &&
      y <= target.bottom + target.height * 0.35;

    const before = sameRow
      ? this.rtl
        ? x > target.left + target.width / 2
        : x < target.left + target.width / 2
      : y < target.top + target.height / 2;

    return Math.max(
      0,
      Math.min(items.length, items.findIndex((x) => x === best) + (before ? 0 : 1)),
    );
  }
}

function detectFlow(el: HTMLElement): Flow {
  const s = getComputedStyle(el);

  if (s.display.includes('grid')) return 'grid';

  if (s.display.includes('flex')) {
    if (s.flexWrap !== 'nowrap') return 'grid';
    return s.flexDirection.startsWith('column') ? 'flex-column' : 'flex-row';
  }

  return 'free';
}

// Internal, DOM-local bridge used to avoid introducing a circular dependency
// between the sorting strategy and DropListRef.
declare global {
  interface HTMLElement {
    __ngxDragItems?: Iterable<DragRef>;
  }
}
