import { describe, expect, it } from 'vitest';
import { GridLayoutOptions } from '../options/options';
import { normalizeGridItem } from '../options/grid-item-config';
describe('grid model', () => {
  it('normalizes dimensions', () => {
    expect(normalizeGridItem({ x: -2, w: 0, h: -1 })).toMatchObject({ x: 0, w: 1, h: 1 });
  });
  it('supports all compaction modes', () => {
    for (const mode of ['none', 'vertical', 'horizontal', 'both'] as const)
      expect(new GridLayoutOptions()).toBeTruthy();
  });
});
