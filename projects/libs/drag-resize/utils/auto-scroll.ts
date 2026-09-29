import { isWindow } from './element.helper';

/**
 * Auto-scrolls the nearest scrollable ancestor (or window) while the pointer
 * is dragged near the edge of the scrollable viewport. Direction-agnostic —
 * works the same in RTL and LTR since it operates on physical scroll deltas.
 */
export class AutoScroller {
  private raf = 0;
  private container: HTMLElement | Window = window;
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
    this.container = findScrollableAncestor(fromEl);
    this.onTick = onTick;
  }

  /** فقط container را عوض می‌کند بدون قطع حلقه‌ی در حال اجرا یا صفر کردن speed. */
  retarget(fromEl: HTMLElement): void {
    this.container = findScrollableAncestor(fromEl);
  }

  update(clientX: number, clientY: number): void {
    const rect = getScrollRect(this.container);
    this.speed = {
      x: edgeSpeed(clientX, rect.left, rect.right, this.edge, this.maxSpeed),
      y: edgeSpeed(clientY, rect.top, rect.bottom, this.edge, this.maxSpeed),
    };
    if ((this.speed.x || this.speed.y) && !this.raf) {
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.speed = { x: 0, y: 0 };
    this.onTick = undefined;
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
      container.scrollLeft += this.speed.x;
      container.scrollTop += this.speed.y;
    }

    // Pointer ثابت مانده ولی محتوا اسکرول شده؛
    // بنابراین موقعیت placeholder/sort را دوباره محاسبه کن.
    this.onTick?.();

    this.raf = requestAnimationFrame(this.tick);
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
    return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  }
  return container.getBoundingClientRect();
}

export function findScrollableAncestor(el: HTMLElement): HTMLElement | Window {
  let node: HTMLElement | null = el;

  while (node) {
    const style = getComputedStyle(node);
    const scrollable = /(auto|scroll|overlay)/.test(style.overflowY + style.overflowX);

    if (scrollable && node.scrollHeight > node.clientHeight) {
      return node;
    }

    node = node.parentElement;
  }

  return el.ownerDocument.defaultView ?? window;
}

export function getScrollPosition(container: HTMLElement | Window): { left: number; top: number } {
  if (isWindow(container)) {
    return { left: window.scrollX, top: window.scrollY };
  }
  return { left: container.scrollLeft, top: container.scrollTop };
}
