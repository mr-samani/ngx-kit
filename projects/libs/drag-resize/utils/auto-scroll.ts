import { isWindow } from './element.helper';
import { convertPointBetweenDocuments, viewportDeltaToLocal } from './coordinate-transform';

/**
 * Auto-scrolls the nearest scrollable ancestor (or window) while the pointer
 * is dragged near the edge of the scrollable viewport. Direction-agnostic —
 * works the same in RTL and LTR since it operates on physical scroll deltas.
 */
export class AutoScroller {
  private raf = 0;
  private container!: HTMLElement | Window;
  private win?: Window;
  /** Document the pointer coordinates (`update(x, y)`) are expressed in. */
  private pointerDoc?: Document;
  private speed = { x: 0, y: 0 };
  private onTick?: () => void;
  private readonly edge: number;
  private readonly maxSpeed: number;

  constructor(edge = 56, maxSpeed = 18) {
    this.edge = edge;
    this.maxSpeed = maxSpeed;
  }

  /** onTick اجرا می‌شود بعد از هر گام اسکرول، تا با آخرین موقعیت pointer، sort/placeholder به‌روز شود. */
  start(fromEl: HTMLElement, onTick?: () => void): void {
    this.win = fromEl.ownerDocument.defaultView ?? undefined;
    this.pointerDoc = fromEl.ownerDocument;
    this.container = findScrollableAncestor(fromEl);
    this.onTick = onTick;
  }

  /** فقط container را عوض می‌کند بدون قطع حلقه‌ی در حال اجرا یا صفر کردن speed. */
  retarget(fromEl: HTMLElement): void {
    this.container = findScrollableAncestor(fromEl);
  }

  update(clientX: number, clientY: number): void {
    // The scroll container may live in another document (a page-builder iframe). Its rect is in
    // THAT document's viewport pixels, so bring the pointer into the same space first.
    let x = clientX;
    let y = clientY;
    const containerDoc = documentOf(this.container);
    if (this.pointerDoc && containerDoc && containerDoc !== this.pointerDoc) {
      const p = convertPointBetweenDocuments({ x, y }, this.pointerDoc, containerDoc);
      if (!p) {
        this.speed = { x: 0, y: 0 };
        return;
      }
      x = p.x;
      y = p.y;
    }
    const rect = getScrollRect(this.container);
    this.speed = {
      x: edgeSpeed(x, rect.left, rect.right, this.edge, this.maxSpeed),
      y: edgeSpeed(y, rect.top, rect.bottom, this.edge, this.maxSpeed),
    };
    if ((this.speed.x || this.speed.y) && !this.raf) {
      this.raf = this.win?.requestAnimationFrame(this.tick) ?? 0;
    }
  }

  stop(): void {
    if (this.raf) this.win?.cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.speed = { x: 0, y: 0 };
    this.onTick = undefined;
    this.win = undefined;
    this.pointerDoc = undefined;
  }

  private tick = (): void => {
    if (!this.speed.x && !this.speed.y) {
      this.raf = 0;
      return;
    }

    const container = this.container;

    if (isWindow(container)) {
      container.scrollBy(this.speed.x, this.speed.y);
    } else {
      // Edge speed is measured in viewport pixels; scrollLeft/Top are local to the scroller.
      const local = viewportDeltaToLocal(container, this.speed);
      container.scrollLeft += local.x;
      container.scrollTop += local.y;
    }

    // Pointer ثابت مانده ولی محتوا اسکرول شده؛
    // بنابراین موقعیت placeholder/sort را دوباره محاسبه کن.
    this.onTick?.();

    this.raf = this.win?.requestAnimationFrame(this.tick) ?? 0;
  };
}

function edgeSpeed(pos: number, min: number, max: number, edge: number, maxSpeed: number): number {
  if (pos < min + edge) return -maxSpeed * (1 - Math.max(0, pos - min) / edge);
  if (pos > max - edge) return maxSpeed * (1 - Math.max(0, max - pos) / edge);
  return 0;
}

function getScrollRect(container: HTMLElement | Window): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  if (isWindow(container)) {
    return { left: 0, top: 0, right: container.innerWidth, bottom: container.innerHeight };
  }
  // A scroller taller than the screen (or partly outside it) is only "edge-sensitive" at the
  // edges the user can actually see: clip its rect to the document viewport.
  const r = container.getBoundingClientRect();
  const win = container.ownerDocument.defaultView;
  if (!win) return r;
  return {
    left: Math.max(r.left, 0),
    top: Math.max(r.top, 0),
    right: Math.min(r.right, win.innerWidth),
    bottom: Math.min(r.bottom, win.innerHeight),
  };
}

function documentOf(container: HTMLElement | Window): Document | null {
  return isWindow(container) ? container.document : container.ownerDocument;
}

export function findScrollableAncestor(el: HTMLElement): HTMLElement | Window {
  let node: HTMLElement | null = el;

  while (node) {
    const win = node.ownerDocument.defaultView;
    if (!win) break;
    const style = win.getComputedStyle(node);
    const scrollable = /(auto|scroll|overlay)/.test(style.overflowY + style.overflowX);

    if (scrollable && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)) {
      // <html>/<body> scroll the whole document: their own rect spans the full (tall) page, so
      // edge detection must use the window's viewport instead.
      const doc = node.ownerDocument;
      if (node === doc.documentElement || node === doc.body) return win;
      return node;
    }

    node = node.parentElement;
  }

  return el.ownerDocument.defaultView ?? el;
}

export function getScrollPosition(container: HTMLElement | Window): { left: number; top: number } {
  if (isWindow(container)) {
    return { left: container.scrollX, top: container.scrollY };
  }
  return { left: container.scrollLeft, top: container.scrollTop };
}
