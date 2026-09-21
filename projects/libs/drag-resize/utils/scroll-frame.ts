/**
 * Tracks how far the scrollable ancestors of an element (and the window) have scrolled since
 * the frame was created.
 *
 * Geometry is measured once, when a drag enters a list. Scrolling afterwards moves the
 * content under a stationary pointer, which is equivalent to moving the pointer by the scroll
 * delta in the frame the geometry was measured in. Shifting the *pointer* (one point) instead
 * of re-measuring every item keeps cached rectangles valid across page scroll, parent scroll
 * and nested scroll without any layout reads on the hot path.
 *
 * `delta()` only reads `scrollLeft/Top` after `invalidate()` (called from a scroll event), so
 * ordinary pointer moves perform zero scroll reads.
 */
export class ScrollFrame {
  private readonly targets: Array<HTMLElement | Window> = [];
  private origin: Point = { x: 0, y: 0 };
  private cached: Point = { x: 0, y: 0 };
  private dirty = false;

  /**
   * @param start   first element to inspect (walks up through its ancestors)
   * @param includeStart whether `start` itself counts (true for a list whose own scroll moves its items)
   */
  constructor(
    start: HTMLElement | null,
    includeStart = true,
    private readonly win: Window = window,
  ) {
    let node: HTMLElement | null = includeStart ? start : (start?.parentElement ?? null);
    const root = start?.ownerDocument.documentElement;
    while (node) {
      // <html> scrolling is reported through `window`; counting both would double the delta.
      if (node !== root && scrolls(node)) this.targets.push(node);
      node = node.parentElement;
    }
    this.targets.push(win);
    this.origin = this.read();
  }

  /** Call when any scroll event fires. */
  invalidate(): void {
    this.dirty = true;
  }

  /** Total scroll distance (px) of all tracked containers since construction. */
  delta(): Point {
    if (this.dirty) {
      const now = this.read();
      this.cached = { x: now.x - this.origin.x, y: now.y - this.origin.y };
      this.dirty = false;
    }
    return this.cached;
  }

  private read(): Point {
    let x = 0;
    let y = 0;
    for (const t of this.targets) {
      if (t === this.win) {
        x += this.win.scrollX;
        y += this.win.scrollY;
      } else {
        x += (t as HTMLElement).scrollLeft;
        y += (t as HTMLElement).scrollTop;
      }
    }
    return { x, y };
  }
}

interface Point {
  x: number;
  y: number;
}

function scrolls(el: HTMLElement): boolean {
  const s = getComputedStyle(el);
  // `hidden` containers still scroll programmatically; `clip` never does.
  const scrollish = (v: string) => v === 'auto' || v === 'scroll' || v === 'overlay' || v === 'hidden';
  return scrollish(s.overflowX) || scrollish(s.overflowY);
}
