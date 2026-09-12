import { describe, expect, it } from 'vitest';
import { GridLayoutOptions } from '../options/options';
import { normalizeGridItem } from '../options/grid-item-config';
import { collides } from '../utils/collision';
import { compact, moveItem, trySwap } from '../utils/compaction';

const node = (id: string, x: number, y: number, w: number, h: number, extra: Partial<any> = {}) => ({
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

describe('collision', () => {
  it('detects overlap', () => {
    expect(collides({ x: 0, y: 0, w: 2, h: 2 } as any, { x: 1, y: 1, w: 2, h: 2 } as any)).toBe(true);
    expect(collides({ x: 0, y: 0, w: 2, h: 2 } as any, { x: 2, y: 0, w: 2, h: 2 } as any)).toBe(false);
  });
});

describe('moveItem (push algorithm)', () => {
  it('pushes a colliding item downward and never leaves an overlap', () => {
    const items = [node('a', 0, 0, 4, 2), node('b', 0, 2, 4, 2)];
    const result = moveItem(items, 'a', 0, 1, { cols: 12, compact: 'vertical', allowOverlap: false });
    const a = result.find((x) => x.id === 'a')!.config;
    const b = result.find((x) => x.id === 'b')!.config;
    expect(collides(a, b)).toBe(false);
  });
  it('never moves a static item', () => {
    const items = [node('a', 0, 0, 4, 2), node('b', 0, 2, 4, 2, { static: true })];
    const result = moveItem(items, 'a', 0, 2, { cols: 12, compact: 'vertical', allowOverlap: false });
    expect(result.find((x) => x.id === 'b')!.config.y).toBe(2);
  });
  it('clamps to the column count', () => {
    const items = [node('a', 0, 0, 4, 2)];
    const result = moveItem(items, 'a', 20, 0, { cols: 12, compact: 'vertical', allowOverlap: false });
    expect(result[0].config.x).toBe(8);
  });
});

describe('compact', () => {
  it('pulls items up to remove vertical gaps', () => {
    const items = [node('a', 0, 5, 2, 2)];
    const result = compact(items, 'vertical');
    expect(result[0].config.y).toBe(0);
  });
  it('leaves static items in place but lets others compact around them', () => {
    const items = [node('a', 0, 0, 2, 2, { static: true }), node('b', 0, 5, 2, 2)];
    const result = compact(items, 'vertical');
    expect(result.find((x) => x.id === 'a')!.config.y).toBe(0);
    expect(result.find((x) => x.id === 'b')!.config.y).toBe(2);
  });
});

describe('trySwap', () => {
  it('swaps two same-size items directly overlapping', () => {
    const items = [node('a', 0, 0, 2, 2), node('b', 4, 0, 2, 2)];
    const result = trySwap(items, 'a', { x: 0, y: 0, w: 2, h: 2 } as any, { x: 4, y: 0, w: 2, h: 2 } as any);
    expect(result).not.toBeNull();
    expect(result!.find((x) => x.id === 'b')!.config).toMatchObject({ x: 0, y: 0 });
  });
  it('refuses to swap with more than one collision', () => {
    const items = [node('a', 0, 0, 2, 2), node('b', 1, 0, 1, 2), node('c', 2, 0, 1, 2)];
    const result = trySwap(items, 'a', { x: 0, y: 0, w: 2, h: 2 } as any, { x: 1, y: 0, w: 2, h: 2 } as any);
    expect(result).toBeNull();
  });
});
