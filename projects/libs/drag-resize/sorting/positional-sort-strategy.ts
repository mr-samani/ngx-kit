import { DragRef } from '../drag-ref';
import { SortResult } from './sort-strategy';

type Flow = 'grid' | 'flex-row' | 'flex-column' | 'free';
interface Snapshot {
  drag: DragRef;
  rect: DOMRect;
  order: number;
}

/** Geometry-driven sorter. It does not assume LTR or a single-axis list. */
export class PositionalSortStrategy {
  private container!: HTMLElement;
  private snapshots: Snapshot[] = [];
  private dragging: DragRef | null = null;
  private index = -1;
  private flow: Flow = 'free';
  private rtl = false;

  withElementContainer(el: HTMLElement): this {
    this.container = el;
    return this;
  }
  withRtl(rtl: boolean): this {
    this.rtl = rtl;
    return this;
  }
  start(items: readonly DragRef<any>[]): void {
    this.flow = detectFlow(this.container);
    this.rtl = getComputedStyle(this.container).direction === 'rtl';
    this.snapshots = items.map((drag, order) => ({
      drag,
      rect: drag.el.getBoundingClientRect(),
      order,
    }));
    this.index = -1;
  }
  enter(drag: DragRef<any>, x: number, y: number): void {
    this.dragging = drag;
    this.movePlaceholder(drag, this.findIndex(x, y));
  }
  sort(drag: DragRef<any>, x: number, y: number): SortResult | null {
    const next = this.findIndex(x, y);
    if (next === this.index) return null;
    const previous = this.index;
    this.movePlaceholder(drag, next);
    return { previousIndex: previous, currentIndex: next };
  }
  getCurrentIndex(): number {
    return Math.max(0, this.index);
  }
  getItemIndex(item: DragRef): number {
    return this.snapshots.findIndex((x) => x.drag === item);
  }
  reset(): void {
    this.dragging = null;
    this.snapshots = [];
    this.index = -1;
  }

  private movePlaceholder(drag: DragRef, index: number): void {
    const ph = drag.getPlaceholderElement();
    if (!ph || !this.container) return;
    const items = this.orderedSnapshots(drag);
    const reference = items[index]?.drag.el ?? null;
    this.container.insertBefore(ph, reference);
    this.index = index;
  }

  private orderedSnapshots(drag: DragRef): Snapshot[] {
    return this.snapshots.filter((x) => x.drag !== drag).sort((a, b) => a.order - b.order);
  }

  private findIndex(x: number, y: number): number {
    const items = this.orderedSnapshots(this.dragging!);
    if (!items.length) return 0;
    if (this.flow === 'flex-row') return this.findFlexRow(items, x);
    if (this.flow === 'flex-column') return this.findFlexColumn(items, y);
    if (this.flow === 'grid') return this.findGrid(items, x, y);
    return this.findFree(items, x, y);
  }

  private findFlexRow(items: Snapshot[], x: number): number {
    for (let i = 0; i < items.length; i++) {
      const r = items[i].rect;
      const mid = r.left + r.width / 2;
      const before = this.rtl ? x > mid : x < mid;
      if (before) return i;
    }
    return items.length;
  }
  private findFlexColumn(items: Snapshot[], y: number): number {
    for (let i = 0; i < items.length; i++)
      if (y < items[i].rect.top + items[i].rect.height / 2) return i;
    return items.length;
  }
  private findGrid(items: Snapshot[], x: number, y: number): number {
    const scored = items
      .map((item, i) => {
        const cx = item.rect.left + item.rect.width / 2;
        const cy = item.rect.top + item.rect.height / 2;
        const dx = Math.abs(x - cx) / Math.max(item.rect.width, 1);
        const dy = Math.abs(y - cy) / Math.max(item.rect.height, 1);
        return { i, score: dx + dy * 1.15 };
      })
      .sort((a, b) => a.score - b.score)[0];
    if (!scored) return 0;
    const target = items[scored.i].rect;
    const sameRow = Math.abs(y - (target.top + target.height / 2)) <= target.height * 0.75;
    const before = sameRow
      ? this.rtl
        ? x > target.left + target.width / 2
        : x < target.left + target.width / 2
      : y < target.top + target.height / 2;
    return Math.max(0, Math.min(items.length, scored.i + (before ? 0 : 1)));
  }
  private findFree(items: Snapshot[], x: number, y: number): number {
    let best = { index: items.length, score: Number.POSITIVE_INFINITY };
    for (let i = 0; i < items.length; i++) {
      const r = items[i].rect;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const score = dx * dx + dy * dy;
      if (score < best.score) best = { index: i, score };
    }
    const r = items[best.index]?.rect;
    if (!r) return items.length;
    const before =
      y < r.top + r.height / 2 ||
      (Math.abs(y - (r.top + r.height / 2)) < r.height * 0.35 &&
        (this.rtl ? x > r.left + r.width / 2 : x < r.left + r.width / 2));
    return best.index + (before ? 0 : 1);
  }
}

function detectFlow(el: HTMLElement): Flow {
  const s = getComputedStyle(el);
  if (s.display.includes('grid')) return 'grid';
  if (s.display.includes('flex'))
    return s.flexDirection.startsWith('column') ? 'flex-column' : 'flex-row';
  return 'free';
}
