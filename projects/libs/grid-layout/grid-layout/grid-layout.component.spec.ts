import { signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { GridItemConfig, normalizeGridItem } from '../options/grid-item-config';
import { GridLayoutOptions } from '../options/options';
import { LayoutOutput } from '../options/layout-output';
import { GridLayoutService } from '../services/grid-layout.service';
import { collides } from '../utils/collision';
import { compact, moveItem, trySwap } from '../utils/compaction';
import { colToLeft, computeMetrics, resizeItem, spanToWidthPx } from '../utils/geometry';

vi.mock('ngx-kit/drag-resize', () => ({ isRtl: () => false }));

const node = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  extra: Partial<any> = {},
) => ({
  id,
  config: { x, y, w, h, ...extra },
});

describe('grid model', () => {
  it('normalizes dimensions', () => {
    expect(normalizeGridItem({ x: -2, w: 0, h: -1 })).toMatchObject({ x: 0, w: 1, h: 1 });
  });
  it('supports all compaction modes', () => {
    for (const mode of ['none', 'vertical', 'horizontal', 'both'] as const) {
      void mode;
      expect(new GridLayoutOptions()).toBeTruthy();
    }
  });
});

describe('grid compaction options', () => {
  it('recompacts and emits when the compact mode changes', () => {
    const options = signal(new GridLayoutOptions());
    const items = signal([{ id: 'item', config: new GridItemConfig(4, 2, 1, 1) }]);
    let emitted: LayoutOutput[] | undefined;
    const service = Object.assign(Object.create(GridLayoutService.prototype), {
      options,
      items,
      activeId: signal<string | null>(null),
      layoutListener: (layout: LayoutOutput[]) => (emitted = layout),
    }) as GridLayoutService;

    service.setOptions({ compact: 'horizontal', pushItems: false });

    expect(items()[0].config).toMatchObject({ x: 0, y: 2 });
    expect(emitted).toMatchObject([{ id: 'item', x: 0, y: 2 }]);
  });
});

describe('collision', () => {
  it('detects overlap', () => {
    expect(collides({ x: 0, y: 0, w: 2, h: 2 } as any, { x: 1, y: 1, w: 2, h: 2 } as any)).toBe(
      true,
    );
    expect(collides({ x: 0, y: 0, w: 2, h: 2 } as any, { x: 2, y: 0, w: 2, h: 2 } as any)).toBe(
      false,
    );
  });
});

describe('moveItem (push algorithm)', () => {
  it('pushes a colliding item downward and never leaves an overlap', () => {
    const items = [node('a', 0, 0, 4, 2), node('b', 0, 2, 4, 2)];
    const result = moveItem(items, 'a', 0, 1, {
      cols: 12,
      compact: 'vertical',
      allowOverlap: false,
    });
    const a = result.find((x) => x.id === 'a')!.config;
    const b = result.find((x) => x.id === 'b')!.config;
    expect(collides(a, b)).toBe(false);
  });
  it('never moves a static item', () => {
    const items = [node('a', 0, 0, 4, 2), node('b', 0, 2, 4, 2, { static: true })];
    const result = moveItem(items, 'a', 0, 2, {
      cols: 12,
      compact: 'vertical',
      allowOverlap: false,
    });
    expect(result.find((x) => x.id === 'b')!.config.y).toBe(2);
  });
  it('clamps to the column count', () => {
    const items = [node('a', 0, 0, 4, 2)];
    const result = moveItem(items, 'a', 20, 0, {
      cols: 12,
      compact: 'vertical',
      allowOverlap: false,
    });
    expect(result[0].config.x).toBe(8);
  });
  it('pushes a horizontal collision chain when there is room', () => {
    const items = [node('a', 0, 0, 1, 1), node('b', 1, 0, 1, 1), node('c', 2, 0, 1, 1)];
    const result = moveItem(items, 'a', 1, 0, {
      cols: 4,
      compact: 'horizontal',
      allowOverlap: false,
    });

    expect(result.map((item) => item.config.x)).toEqual([1, 2, 3]);
    expect(collides(result[0].config, result[1].config)).toBe(false);
    expect(collides(result[1].config, result[2].config)).toBe(false);
  });
  it('moves a horizontal push overflow to the next free row', () => {
    const items = [
      node('a', 0, 0, 1, 1),
      node('b', 1, 0, 1, 1),
      node('c', 2, 0, 1, 1),
      node('d', 3, 0, 1, 1),
    ];
    const result = moveItem(items, 'a', 1, 0, {
      cols: 4,
      compact: 'horizontal',
      allowOverlap: false,
    });

    expect(result.map((item) => [item.config.x, item.config.y])).toEqual([
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
    ]);
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        expect(collides(result[i].config, result[j].config)).toBe(false);
      }
    }
  });
  it('still applies a move when overlap is allowed', () => {
    const items = [node('a', 0, 0, 1, 1), node('b', 1, 0, 1, 1)];
    const result = moveItem(items, 'a', 1, 0, {
      cols: 4,
      compact: 'horizontal',
      allowOverlap: true,
    });

    expect(result[0].config.x).toBe(1);
  });
});

describe('compact', () => {
  it('pulls items up to remove vertical gaps', () => {
    const items = [node('a', 0, 5, 2, 2)];
    const result = compact(items, 'vertical');
    expect(result[0].config.y).toBe(0);
  });
  it('packs items toward the start edge in horizontal mode', () => {
    const items = [node('a', 4, 0, 2, 1), node('b', 2, 2, 1, 1)];
    const result = compact(items, 'horizontal');

    expect(result.find((x) => x.id === 'a')!.config).toMatchObject({ x: 0, y: 0 });
    expect(result.find((x) => x.id === 'b')!.config).toMatchObject({ x: 0, y: 2 });
  });
  it('performs vertical then horizontal compaction in both mode', () => {
    const items = [node('a', 5, 4, 2, 2), node('b', 0, 0, 2, 2)];
    const result = compact(items, 'both');

    expect(result.find((x) => x.id === 'a')!.config).toMatchObject({ x: 2, y: 0 });
  });
  it('leaves static items in place but lets others compact around them', () => {
    const items = [node('a', 0, 0, 2, 2, { static: true }), node('b', 0, 5, 2, 2)];
    const result = compact(items, 'vertical');
    expect(result.find((x) => x.id === 'a')!.config.y).toBe(0);
    expect(result.find((x) => x.id === 'b')!.config.y).toBe(2);
  });
  it('keeps the active item at its preview position while compacting siblings', () => {
    const items = [node('active', 0, 3, 2, 2), node('sibling', 0, 8, 2, 2)];
    const result = compact(items, 'vertical', 'active');

    expect(result.find((x) => x.id === 'active')!.config.y).toBe(3);
    expect(result.find((x) => x.id === 'sibling')!.config.y).toBe(5);
  });
  it('compacts the active placeholder upward in vertical mode', () => {
    const items = [node('blocker', 0, 0, 2, 1), node('active', 0, 4, 2, 1)];
    const result = compact(items, 'vertical');

    expect(result.find((x) => x.id === 'active')!.config.y).toBe(1);
  });
  it('compacts the active placeholder toward the start edge in horizontal mode', () => {
    const items = [node('blocker', 0, 0, 2, 1), node('active', 5, 0, 2, 1)];
    const result = compact(items, 'horizontal');

    expect(result.find((x) => x.id === 'active')!.config.x).toBe(2);
  });
  it('does not compact the active placeholder in none mode', () => {
    const items = [node('active', 0, 4, 2, 1)];
    const result = compact(items, 'none');

    expect(result[0].config.y).toBe(4);
  });
});

describe('trySwap', () => {
  it('swaps two same-size items directly overlapping', () => {
    const items = [node('a', 0, 0, 2, 2), node('b', 4, 0, 2, 2)];
    const result = trySwap(
      items,
      'a',
      { x: 0, y: 0, w: 2, h: 2 } as any,
      { x: 4, y: 0, w: 2, h: 2 } as any,
    );
    expect(result).not.toBeNull();
    expect(result!.find((x) => x.id === 'b')!.config).toMatchObject({ x: 0, y: 0 });
  });
  it('refuses to swap with more than one collision', () => {
    const items = [node('a', 0, 0, 2, 2), node('b', 1, 0, 1, 2), node('c', 2, 0, 1, 2)];
    const result = trySwap(
      items,
      'a',
      { x: 0, y: 0, w: 2, h: 2 } as any,
      { x: 1, y: 0, w: 2, h: 2 } as any,
    );
    expect(result).toBeNull();
  });
});

describe('resizeItem', () => {
  it('converts resized spans using both cell dimensions and inter-cell gaps', () => {
    const metrics = computeMetrics(140, { cols: 4, rowHeight: 50, gap: 20 });
    const resized = resizeItem(
      { x: 0, y: 0, w: 1, h: 1 },
      {
        width: spanToWidthPx(2, metrics),
        height: 50,
        left: 0,
        top: 0,
      },
      metrics,
      false,
    );

    expect(resized.w).toBe(2);
  });

  it('places a resized item from the final physical box in RTL', () => {
    const metrics = computeMetrics(500, { cols: 4, rowHeight: 50, gap: 10 });
    const targetLeft = colToLeft(0, 3, metrics, true);
    const resized = resizeItem(
      { x: 1, y: 0, w: 2, h: 1 },
      {
        width: spanToWidthPx(3, metrics),
        height: 50,
        left: targetLeft,
        top: 0,
      },
      metrics,
      true,
    );

    expect(resized).toMatchObject({ x: 0, w: 3 });
  });
});
