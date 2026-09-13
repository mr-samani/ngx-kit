import { describe, expect, it, vi } from 'vitest';
import { DragRef } from '../drag-ref';
import { PositionalSortStrategy } from '../sorting/positional-sort-strategy';
const createDrag = (r: DOMRect) => {
  const el = document.createElement('div');

  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(r);

  const placeholder = document.createElement('div');
  placeholder.classList.add('ngx-drag-placeholder');

  return {
    el,
    getPlaceholderElement: vi.fn(() => placeholder),
  } as unknown as DragRef;
};
const rect = (left: number, top: number, width = 100, height = 40): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  }) as DOMRect;

describe('PositionalSortStrategy', () => {
  it('moves placeholder to the calculated position', () => {
    const container = document.createElement('div');
    container.style.display = 'grid';

    const a = createDrag(rect(0, 0));
    const b = createDrag(rect(110, 0));
    const c = createDrag(rect(0, 50));

    container.append(a.el, b.el, c.el);

    container.__ngxDragItems = [a, b, c];

    const strategy = new PositionalSortStrategy().withElementContainer(container);

    strategy.start([a, b, c]);
    strategy.enter(a, 20, 70);

    const placeholder = a.getPlaceholderElement();

    expect(placeholder?.parentElement).toBe(container);
  });

  it('places the dragged item before the second-row item', () => {
    const container = document.createElement('div');
    container.style.display = 'grid';

    const a = createDrag(rect(0, 0));
    const b = createDrag(rect(110, 0));
    const d = createDrag(rect(0, 50));

    container.append(a.el, b.el, d.el);

    container.__ngxDragItems = [a, b, d];

    const strategy = new PositionalSortStrategy().withElementContainer(container);

    strategy.start([a, b, d]);

    strategy.enter(a, 20, 70);

    expect(strategy.getCurrentIndex()).toBe(1);
  });

  it('calculates the insertion index for a grid layout', () => {
    const container = document.createElement('div');
    container.style.display = 'grid';

    const a = createDrag(rect(0, 0));
    const b = createDrag(rect(110, 0));
    const d = createDrag(rect(0, 50));

    container.append(a.el, b.el, d.el);

    container.__ngxDragItems = [a, b, d];

    const strategy = new PositionalSortStrategy().withElementContainer(container);

    strategy.start([a, b, d]);

    strategy.enter(a, 20, 70);

    expect(strategy.getCurrentIndex()).toBe(1);
  });

  it('handles RTL horizontal ordering', () => {
    const container = document.createElement('div');

    container.style.display = 'flex';
    container.style.direction = 'rtl';
    container.style.flexDirection = 'row';

    const a = createDrag(rect(0, 0));
    const b = createDrag(rect(110, 0));

    container.append(a.el, b.el);

    container.__ngxDragItems = [a, b];

    const strategy = new PositionalSortStrategy().withElementContainer(container);

    strategy.start([a, b]);

    strategy.enter(a, 10, 10);

    expect(strategy.getCurrentIndex()).toBe(1);
  });
});
