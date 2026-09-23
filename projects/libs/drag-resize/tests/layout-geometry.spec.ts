import { describe, expect, it } from 'vitest';
import {
  Box,
  analyzeLayout,
  computeAxisOffsets,
  hysteresis,
  resolveInsertionIndex,
} from '../sorting/layout-geometry';

const box = (left: number, top: number, w: number, h: number): Box => ({ left, top, right: left + w, bottom: top + h });
const column = (n: number, h = 40, gap = 0) => Array.from({ length: n }, (_, i) => box(0, i * (h + gap), 100, h));
const row = (n: number, w = 80, gap = 0, rtl = false) =>
  Array.from({ length: n }, (_, i) => (rtl ? box(1000 - (i + 1) * w - i * gap, 0, w, 40) : box(i * (w + gap), 0, w, 40)));
const grid = (n: number, cols: number, w = 80, h = 40, gap = 10, rtl = false) =>
  Array.from({ length: n }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return rtl ? box(1000 - (c + 1) * w - c * gap, r * (h + gap), w, h) : box(c * (w + gap), r * (h + gap), w, h);
  });

describe('analyzeLayout: orientation comes from geometry', () => {
  it('detects column, row and grid', () => {
    expect(analyzeLayout(column(4)).axis).toBe('y');
    expect(analyzeLayout(row(4)).axis).toBe('x');
    expect(analyzeLayout(grid(7, 3)).axis).toBe('grid');
  });

  it('detects direction from where DOM order actually lands (RTL, row-reverse)', () => {
    expect(analyzeLayout(row(4)).dirX).toBe(1);
    expect(analyzeLayout(row(4, 80, 0, true)).dirX).toBe(-1);
    expect(analyzeLayout(grid(6, 3, 80, 40, 10, true)).dirX).toBe(-1);
    const upward = [box(0, 90, 50, 40), box(0, 40, 50, 40), box(0, -10, 50, 40)];
    expect(analyzeLayout(upward).dirY).toBe(-1); // column-reverse
  });

  it('treats sub-pixel overlaps and touching rows as different rows, tall neighbours as the same row', () => {
    const touching = [box(0, 0, 50, 40.3), box(0, 40, 50, 40)];
    expect(analyzeLayout(touching).axis).toBe('y');
    const mixedHeights = [box(0, 0, 50, 100), box(60, 0, 50, 30), box(120, 20, 50, 60)];
    expect(analyzeLayout(mixedHeights).axis).toBe('x');
  });

  it('falls back to the supplied hint only when too small to tell', () => {
    expect(analyzeLayout([], 'x').axis).toBe('x');
    expect(analyzeLayout([box(0, 0, 10, 10)], 'y').axis).toBe('y');
    expect(analyzeLayout([box(0, 0, 10, 10)], 'y', true).dirX).toBe(-1);
  });
});

describe('resolveInsertionIndex', () => {
  const at = (boxes: Box[], slot: number, x: number, y: number, cur: number | null = null) =>
    resolveInsertionIndex(analyzeLayout(boxes), boxes, slot, { x, y }, cur);

  it('column: number of siblings whose mid-line is above the pointer', () => {
    const b = column(4); // mids 20,60,100,140 ; slot = 1
    expect(at(b, 1, 50, 5)).toBe(0);
    expect(at(b, 1, 50, 70)).toBe(1); // 20 <mid=... A before, C(100) not yet
    expect(at(b, 1, 50, 110)).toBe(2);
    expect(at(b, 1, 50, 500)).toBe(3);
    expect(at(b, 1, 50, -500)).toBe(0);
  });

  it('never depends on the previous index except inside the hysteresis band', () => {
    const b = column(6);
    const slot = 2;
    for (let y = -30; y < 300; y += 3) {
      const results = new Set<number>();
      for (let cur = 0; cur <= 5; cur++) {
        const r = at(b, slot, 50, y, cur);
        // determine whether y is inside any sibling's band
        const nearMid = b.some((bx, i) => i !== slot && Math.abs((bx.top + bx.bottom) / 2 - y) <= hysteresis(40) + 1e-9);
        if (!nearMid) results.add(r);
      }
      if (results.size) expect(results.size).toBe(1);
    }
  });

  it('is monotonic and reversible: sweeping down then up visits the same states outside the band', () => {
    const b = column(8, 40, 6);
    const slot = 3;
    const down: number[] = [];
    let cur = slot;
    for (let y = -20; y <= 400; y += 5) down.push((cur = at(b, slot, 50, y, cur)));
    const up: number[] = [];
    for (let y = 400; y >= -20; y -= 5) up.push((cur = at(b, slot, 50, y, cur)));
    up.reverse();
    let differing = 0;
    down.forEach((v, i) => {
      if (v !== up[i]) {
        differing++;
        // every disagreement must sit inside a hysteresis band
        const y = -20 + i * 5;
        expect(b.some((bx, k) => k !== slot && Math.abs((bx.top + bx.bottom) / 2 - y) <= hysteresis(40) + 5)).toBe(true);
      }
      if (i) expect(v).toBeGreaterThanOrEqual(down[i - 1]); // monotonic non-decreasing while sweeping down
    });
    expect(differing).toBeLessThan(down.length / 4);
  });

  it('row LTR vs RTL: reading order flips with direction, not with a blind reversal', () => {
    const ltr = row(4);
    const rtl = row(4, 80, 0, true);
    // pointer just past the mid-line of item 2 in reading order
    expect(at(ltr, 0, ltr[2].left + 40 + 10, 20)).toBe(2);
    expect(at(rtl, 0, rtl[2].left + 40 - 10, 20)).toBe(2);
    // ...and just before it
    expect(at(ltr, 0, ltr[2].left + 40 - 10, 20)).toBe(1);
    expect(at(rtl, 0, rtl[2].left + 40 + 10, 20)).toBe(1);
  });

  it('grid: row first, then position inside the row; row gaps split at the mid-line', () => {
    const g = grid(8, 3); // rows at y 0,50,100 ; cols x 0,90,180
    const slot = 4;
    expect(at(g, slot, 300, 20)).toBe(3); // row 0, right of everything in the row -> after first 3 items
    expect(at(g, slot, 200, 20)).toBe(2); // ...but left of the 3rd column's mid-line (220) -> before item 2
    expect(at(g, slot, 5, 55)).toBe(3); // row 1, before item 3's mid (40) -> only the first row precedes
    expect(at(g, slot, 300, 55)).toBe(5); // end of row 1: items 0,1,2,3 and 5 all precede it (slot excluded)
    expect(at(g, slot, 50, 200)).toBe(7); // below everything
    expect(at(g, slot, 50, -50)).toBe(0); // above everything
    // in the 10px gap between rows 0 and 1 (y 40..50): boundary is 45
    expect(at(g, slot, 5, 44)).toBe(0);
    expect(at(g, slot, 5, 46)).toBe(3);
  });

  it('grid RTL mirrors x only', () => {
    const g = grid(6, 3, 80, 40, 10, true);
    expect(at(g, 5, g[1].left + 40 + 10 * -1, 20)).toBeDefined();
    expect(at(g, 5, g[1].left + 40 - 10, 20)).toBe(2); // moving toward the left = later in RTL reading order
    expect(at(g, 5, g[1].left + 40 + 10, 20)).toBe(1);
  });

  it('empty and single-item lists', () => {
    expect(resolveInsertionIndex(analyzeLayout([]), [], -1, { x: 5, y: 5 }, null)).toBe(0);
    const one = [box(0, 0, 50, 50)];
    expect(resolveInsertionIndex(analyzeLayout(one), one, 0, { x: 999, y: 999 }, 0)).toBe(0); // only the slot
    expect(resolveInsertionIndex(analyzeLayout(one), one, -1, { x: 10, y: 10 }, null)).toBe(0);
    expect(resolveInsertionIndex(analyzeLayout(one), one, -1, { x: 10, y: 90 }, null)).toBe(1);
  });
});

describe('computeAxisOffsets', () => {
  it('moves the slot down: intermediate items shift up by the slot size + gap', () => {
    const b = column(4, 40, 10);
    const m = analyzeLayout(b);
    expect(computeAxisOffsets(m, b, 1, 2)).toEqual([0, 50, -50, 0]);
    expect(computeAxisOffsets(m, b, 1, 3)).toEqual([0, 100, -50, -50]);
    expect(computeAxisOffsets(m, b, 1, 1)).toEqual([0, 0, 0, 0]);
    expect(computeAxisOffsets(m, b, 2, 0)).toEqual([50, 50, -100, 0]);
  });

  it('handles variable sizes and per-slot gaps exactly', () => {
    const b = [box(0, 0, 10, 30), box(0, 40, 10, 70), box(0, 120, 10, 50), box(0, 190, 10, 40)];
    const m = analyzeLayout(b);
    // slot 1 (h=70) to the end: 2 -> up by 70+gap(10)=80? item2 moves to y=40 : delta -80 ; item3 to 40+50+10=100: delta -90; slot to 160
    expect(computeAxisOffsets(m, b, 1, 3)).toEqual([0, 120, -80, -90]);
  });

  it('RTL and row-reverse: physical sign is mirrored so the picture is identical', () => {
    const ltr = row(4, 80, 10);
    const rtl = row(4, 80, 10, true);
    const a = computeAxisOffsets(analyzeLayout(ltr), ltr, 0, 2);
    const b = computeAxisOffsets(analyzeLayout(rtl), rtl, 0, 2);
    expect(a).toEqual([180, -90, -90, 0]);
    expect(b).toEqual(a.map((v) => (v === 0 ? 0 : -v)));
  });

  it('does nothing for grids (they reflow instead)', () => {
    const g = grid(6, 3);
    expect(computeAxisOffsets(analyzeLayout(g), g, 1, 4)).toEqual([0, 0, 0, 0, 0, 0]);
  });
});
