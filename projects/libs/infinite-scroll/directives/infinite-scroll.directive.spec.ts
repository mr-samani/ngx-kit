import { describe, expect, it } from 'vitest';
import { NgxInfiniteScroll } from './infinite-scroll.directive';

describe('NgxInfiniteScroll', () => {
  it('exports the directive with the expected selector', () => {
    const metadata = (NgxInfiniteScroll as unknown as { ɵdir: { selectors: unknown } }).ɵdir;
    expect(metadata.selectors).toEqual([['', 'infiniteScroll', '']]);
  });

  it('exposes the public infinite scroll API', () => {
    const metadata = (NgxInfiniteScroll as unknown as {
      ɵdir: {
        inputs: Record<string, string>;
        outputs: Record<string, string>;
      };
    }).ɵdir;

    expect(metadata.inputs['infiniteScrollDistance']).toBe('infiniteScrollDistance');
    expect(metadata.inputs['infiniteScrollDirection']).toBe('infiniteScrollDirection');
    expect(metadata.inputs['infiniteScrollUpDistance']).toBe('infiniteScrollUpDistance');
    expect(metadata.inputs['infiniteScrollDownDistance']).toBe('infiniteScrollDownDistance');
    expect(metadata.inputs['infiniteScrollMaintainScrollPosition']).toBe('infiniteScrollMaintainScrollPosition');
    expect(metadata.outputs['scrolled']).toBe('scrolled');
    expect(metadata.outputs['scrolledUp']).toBe('scrolledUp');
    expect(metadata.outputs['scrolledDown']).toBe('scrolledDown');
    expect(metadata.outputs['scrollStartReached']).toBe('scrollStartReached');
    expect(metadata.outputs['scrollEndReached']).toBe('scrollEndReached');
  });
});
