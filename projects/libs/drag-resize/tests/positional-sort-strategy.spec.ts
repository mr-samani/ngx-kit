import { describe, expect, it } from 'vitest';
import { PositionalSortStrategy } from '../sorting/positional-sort-strategy';
const rect = (left: number, top: number, width = 100, height = 40) =>
  ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;
const drag = (r: DOMRect) => ({ el: { getBoundingClientRect: () => r } }) as any;
describe('PositionalSortStrategy', () => {
  it('handles flex-wrap-like rows as a grid', () => {
    const c = document.createElement('div');
    c.style.display = 'grid';
    const a = drag(rect(0, 0)),
      b = drag(rect(110, 0)),
      d = drag(rect(0, 50));
    [a, b, d].forEach((x) => c.appendChild(x.el));
    const s = new PositionalSortStrategy().withElementContainer(c);
    s.start([a, b, d]);
    s.enter(a, 20, 70);
    expect(s.getCurrentIndex()).toBe(2);
  });
  it('handles RTL horizontal ordering', () => {
    const c = document.createElement('div');
    c.style.display = 'flex';
    c.style.direction = 'rtl';
    c.style.flexDirection = 'row';
    const a = drag(rect(0, 0)),
      b = drag(rect(110, 0));
    [a, b].forEach((x) => c.appendChild(x.el));
    const s = new PositionalSortStrategy().withElementContainer(c);
    s.start([a, b]);
    s.enter(a, 10, 10);
    expect(s.getCurrentIndex()).toBe(1);
  });
});
