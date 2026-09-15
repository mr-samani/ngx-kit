/**
 * jsdom doesn't implement the Popover API or ResizeObserver. These are
 * minimal, good-enough-for-tests polyfills shared by the dialog module's
 * spec files (the overlay module's own spec file has its own copy, since
 * it may live in a separate secondary entry point / package).
 */

export function installPopoverPolyfillIfMissing(): void {
  if (typeof (HTMLElement.prototype as any).showPopover === 'function') {
    return;
  }

  const openPopovers = new WeakSet<HTMLElement>();

  (HTMLElement.prototype as any).showPopover = function (this: HTMLElement): void {
    if (openPopovers.has(this)) {
      throw new DOMException('Invalid on popover show: already open', 'InvalidStateError');
    }
    openPopovers.add(this);
    this.setAttribute('data-popover-open', '');
  };

  (HTMLElement.prototype as any).hidePopover = function (this: HTMLElement): void {
    if (!openPopovers.has(this)) {
      throw new DOMException('Invalid on popover hide: not open', 'InvalidStateError');
    }
    openPopovers.delete(this);
    this.removeAttribute('data-popover-open');
  };

  (HTMLElement.prototype as any).togglePopover = function (
    this: HTMLElement,
    force?: boolean,
  ): boolean {
    const shouldOpen = force ?? !openPopovers.has(this);
    if (shouldOpen) {
      (this as any).showPopover();
    } else {
      (this as any).hidePopover();
    }
    return shouldOpen;
  };

  const originalMatches = HTMLElement.prototype.matches;
  HTMLElement.prototype.matches = function (this: HTMLElement, selector: string): boolean {
    if (selector === ':popover-open') {
      return openPopovers.has(this);
    }
    return originalMatches.call(this, selector);
  } as any;

  if (!('popover' in HTMLElement.prototype)) {
    Object.defineProperty(HTMLElement.prototype, 'popover', {
      configurable: true,
      get(this: HTMLElement) {
        return this.getAttribute('popover');
      },
      set(this: HTMLElement, value: string | null) {
        if (value === null) {
          this.removeAttribute('popover');
        } else {
          this.setAttribute('popover', value);
        }
      },
    });
  }
}

export function installResizeObserverPolyfillIfMissing(): void {
  if (typeof (globalThis as any).ResizeObserver === 'function') {
    return;
  }
  class FakeResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(): void {
      // Fire once synchronously so directives that call `recompute()` inside
      // the observer's own callback still get an initial measurement.
      this.callback([] as unknown as ResizeObserverEntry[], this as unknown as ResizeObserver);
    }
    unobserve(): void {}
    disconnect(): void {}
  }
  (globalThis as any).ResizeObserver = FakeResizeObserver;
}
