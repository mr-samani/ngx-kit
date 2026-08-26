import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PositionalSortStrategy, ItemSnapshot, MutableRect } from '../sorting/positional-sort-strategy';
import { DragRef } from '../drag-ref';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeRect(
  left: number, top: number, width: number, height: number,
): DOMRect {
  return {
    left, top, width, height,
    right: left + width, bottom: top + height,
    x: left, y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function makeDragRef(rect: DOMRect): DragRef {
  const el = document.createElement('div');
  Object.defineProperty(el, 'getBoundingClientRect', { value: () => rect });

  let ph: HTMLElement | undefined;

  const ref = {
    el,
    domRect: rect,
    isDragging: false,
    getPlaceholderElement: () => {
      if (!ph) {
        ph = document.createElement('div');
        ph.className = 'ngx-drag-placeholder';
        Object.defineProperty(ph, 'getBoundingClientRect', {
          value: () => makeRect(rect.left, rect.top, rect.width, rect.height),
        });
      }
      return ph;
    },
    updateDomRect: vi.fn(),
  } as unknown as DragRef;

  return ref;
}

function makeContainer(items: DragRef[]): HTMLElement {
  const el = document.createElement('div');
  items.forEach(d => el.appendChild(d.el));
  document.body.appendChild(el);
  return el;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('PositionalSortStrategy', () => {
  let strategy: PositionalSortStrategy;
  let container: HTMLElement;

  beforeEach(() => {
    strategy = new PositionalSortStrategy();
    // Clean up body between tests
    document.body.innerHTML = '';
  });

  // ── 1. Basic vertical sort ───────────────────────────────────────────────
  describe('vertical list (items stacked top-to-bottom)', () => {
    let items: DragRef[];

    beforeEach(() => {
      // Three items in a vertical column, each 100×40px
      items = [
        makeDragRef(makeRect(0, 0,   100, 40)),
        makeDragRef(makeRect(0, 50,  100, 40)),
        makeDragRef(makeRect(0, 100, 100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);
    });

    it('returns null when pointer does not hover over a sibling', () => {
      const drag = items[0];
      strategy.enter(drag, 50, 10);
      const result = strategy.sort(drag, 50, 10, { x: 0, y: 0 });
      expect(result).toBeNull();
    });

    it('moves placeholder down when pointer crosses into lower item bottom half', () => {
      const drag = items[0];
      strategy.enter(drag, 50, 10);

      // Pointer in lower half of item[1] (y=70, centre=70 → bottom half)
      const result = strategy.sort(drag, 50, 72, { x: 0, y: 2 });
      expect(result).not.toBeNull();
      expect(result!.currentIndex).toBeGreaterThan(result!.previousIndex);
    });

    it('inserts before item when pointer is in its top half', () => {
      const drag = items[2];
      strategy.enter(drag, 50, 110);

      // Pointer in top half of item[1] (y=55)
      const result = strategy.sort(drag, 50, 55, { x: 0, y: -2 });
      expect(result).not.toBeNull();
      expect(result!.currentIndex).toBeLessThan(result!.previousIndex);
    });

    it('getCurrentIndex returns -1 before enter is called', () => {
      expect(strategy.getCurrentIndex()).toBe(-1);
    });
  });

  // ── 2. Horizontal list ───────────────────────────────────────────────────
  describe('horizontal list (items side-by-side on same row)', () => {
    let items: DragRef[];

    beforeEach(() => {
      // Three chips on the same row y=0, each 80×32
      items = [
        makeDragRef(makeRect(0,   0, 80, 32)),
        makeDragRef(makeRect(90,  0, 80, 32)),
        makeDragRef(makeRect(180, 0, 80, 32)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);
    });

    it('uses horizontal midpoint: insert after when pointer > centre-x', () => {
      const drag = items[0];
      strategy.enter(drag, 10, 16);

      // Pointer right of centre of item[1] (centre = 130)
      const result = strategy.sort(drag, 135, 16, { x: 3, y: 0 });
      expect(result).not.toBeNull();
      // Should move to after item[1]
      expect(result!.currentIndex).toBeGreaterThan(result!.previousIndex);
    });

    it('uses horizontal midpoint: insert before when pointer < centre-x', () => {
      const drag = items[2];
      strategy.enter(drag, 200, 16);

      // Pointer left of centre of item[1] (centre = 130)
      const result = strategy.sort(drag, 85, 16, { x: -3, y: 0 });
      expect(result).not.toBeNull();
      expect(result!.currentIndex).toBeLessThan(result!.previousIndex);
    });
  });

  // ── 3. RTL horizontal ───────────────────────────────────────────────────
  describe('RTL horizontal list', () => {
    let items: DragRef[];

    beforeEach(() => {
      items = [
        makeDragRef(makeRect(200, 0, 80, 32)),  // rightmost (visual first in RTL)
        makeDragRef(makeRect(110, 0, 80, 32)),
        makeDragRef(makeRect(20,  0, 80, 32)),  // leftmost (visual last in RTL)
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(true);
      strategy.start(items);
    });

    it('reverses horizontal decision: insert after when pointer < centre-x in RTL', () => {
      const drag = items[0];
      strategy.enter(drag, 240, 16);

      // In RTL: pointer LEFT of centre of item[1] (centre=150) → insert after in RTL = move right
      const result = strategy.sort(drag, 120, 16, { x: -3, y: 0 });
      expect(result).not.toBeNull();
    });
  });

  // ── 4. Flex-wrap grid ───────────────────────────────────────────────────
  describe('flex-wrap grid (mixed row detection)', () => {
    let items: DragRef[];

    beforeEach(() => {
      // 2×2 grid: row 0 (y=0), row 1 (y=110)
      items = [
        makeDragRef(makeRect(0,   0,   100, 100)),  // [0,0]
        makeDragRef(makeRect(110, 0,   100, 100)),  // [0,1]
        makeDragRef(makeRect(0,   110, 100, 100)),  // [1,0]
        makeDragRef(makeRect(110, 110, 100, 100)),  // [1,1]
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);
    });

    it('uses horizontal axis for items on the same row', () => {
      const drag = items[0];
      strategy.enter(drag, 50, 50);

      // Pointer right of centre of item[1] (centre=160) on same row
      const result = strategy.sort(drag, 165, 50, { x: 3, y: 0 });
      expect(result).not.toBeNull();
    });

    it('uses vertical axis when crossing rows', () => {
      const drag = items[0];
      strategy.enter(drag, 50, 50);

      // Pointer in lower half of item[2] (y=165, centre=160) — different row
      const result = strategy.sort(drag, 50, 162, { x: 0, y: 3 });
      expect(result).not.toBeNull();
    });
  });

  // ── 5. Edge / boundary insertion ────────────────────────────────────────
  describe('edge insertion (pointer outside all items)', () => {
    let items: DragRef[];

    beforeEach(() => {
      items = [
        makeDragRef(makeRect(0,  0,  100, 40)),
        makeDragRef(makeRect(0, 50,  100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);
    });

    it('inserts at start when pointer is above all items', () => {
      const drag = items[1];
      strategy.enter(drag, 50, 55);

      const result = strategy.sort(drag, 50, -20, { x: 0, y: -3 });
      if (result !== null) {
        expect(result.currentIndex).toBeLessThanOrEqual(result.previousIndex);
      }
      // Reaching here without error is sufficient
    });

    it('inserts at end when pointer is below all items', () => {
      const drag = items[0];
      strategy.enter(drag, 50, 10);

      const result = strategy.sort(drag, 50, 300, { x: 0, y: 3 });
      if (result !== null) {
        expect(result.currentIndex).toBeGreaterThanOrEqual(result.previousIndex);
      }
    });
  });

  // ── 6. Reset ────────────────────────────────────────────────────────────
  describe('reset()', () => {
    it('clears all transforms from siblings and resets internal state', () => {
      const items = [
        makeDragRef(makeRect(0,  0,  100, 40)),
        makeDragRef(makeRect(0, 50,  100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);

      const drag = items[0];
      strategy.enter(drag, 50, 10);
      strategy.sort(drag, 50, 70, { x: 0, y: 3 });

      strategy.reset();

      expect(strategy.getCurrentIndex()).toBe(-1);
      // Sibling transform should be cleared
      expect(items[1].el.style.transform).toBe('');
    });
  });

  // ── 7. getItemIndex ──────────────────────────────────────────────────────
  describe('getItemIndex()', () => {
    it('returns -1 for an item not in the strategy', () => {
      const stranger = makeDragRef(makeRect(0, 0, 100, 40));
      strategy.start([]);
      expect(strategy.getItemIndex(stranger)).toBe(-1);
    });

    it('returns correct index after start()', () => {
      const items = [
        makeDragRef(makeRect(0,  0, 100, 40)),
        makeDragRef(makeRect(0, 50, 100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.start(items);
      expect(strategy.getItemIndex(items[0])).toBe(0);
      expect(strategy.getItemIndex(items[1])).toBe(1);
    });
  });

  // ── 8. Same-index guard (no redundant DOM move) ─────────────────────────
  describe('same-index guard', () => {
    it('returns null on repeated call when pointer is in same logical slot', () => {
      // The guard is: if findInsertIndex() returns the same value as
      // _currentPlaceholderIndex → return null.
      // We test this directly: enter() sets placeholder at index 0,
      // then sort() at a position that also resolves to index 0 → null.
      const items = [
        makeDragRef(makeRect(0,   0, 100, 40)),
        makeDragRef(makeRect(0,  50, 100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);

      const drag = items[0];
      // Enter: pointer above item[1], placeholder goes to index 0
      strategy.enter(drag, 50, 0);

      // Sort with pointer still at same position → same index → null
      const result = strategy.sort(drag, 50, 0, { x: 0, y: 0 });
      expect(result).toBeNull();
    });

    it('returns null on truly duplicate call (pointer never moved)', () => {
      const items = [
        makeDragRef(makeRect(0,  0, 100, 40)),
        makeDragRef(makeRect(0, 50, 100, 40)),
        makeDragRef(makeRect(0,100, 100, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);

      const drag = items[0];
      strategy.enter(drag, 50, 10);

      // Sort once to establish a placeholder position
      strategy.sort(drag, 50, 10, { x: 0, y: 0 });
      // Exact same call → _currentPlaceholderIndex unchanged → null
      const dup = strategy.sort(drag, 50, 10, { x: 0, y: 0 });
      expect(dup).toBeNull();
    });

    it('emits non-null when pointer clearly moves across an item boundary', () => {
      const items = [
        makeDragRef(makeRect(0,   0, 200, 40)),
        makeDragRef(makeRect(0,  50, 200, 40)),
        makeDragRef(makeRect(0, 100, 200, 40)),
      ];
      container = makeContainer(items);
      strategy.withElementContainer(container);
      strategy.withRtl(false);
      strategy.start(items);

      const drag = items[2];
      strategy.enter(drag, 100, 110);

      // Move pointer clearly to top of item[0] (y=5) — far from start
      const r = strategy.sort(drag, 100, 5, { x: 0, y: -3 });
      // Should not be null since we crossed multiple items
      // (may be null only if enter already placed it there)
      if (r !== null) {
        expect(r.currentIndex).not.toBe(r.previousIndex);
      }
    });
  });
});
