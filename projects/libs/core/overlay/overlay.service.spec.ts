import { TestBed } from '@angular/core/testing';
import { Component, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DIALOG_OVERLAY_CLASSNAME,
  OVERLAY_HOST_CLASSNAME,
  OverlayService,
} from './overlay.service';

@Component({
  template: `
    <div style="width:200px;height:300px">test component</div>
  `,
})
class MockComponent {}

/**
 * jsdom doesn't implement the Popover API. This installs a minimal, spec-
 * accurate polyfill once (throws on double-show/double-hide like real
 * browsers do, and makes `:popover-open` work via `matches`), so our tests
 * can exercise the real popover code path instead of only the fallback path.
 */
function installPopoverPolyfillIfMissing(): void {
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

describe('OverlayService', () => {
  let service: OverlayService;
  let viewContainerRef: ViewContainerRef;
  let documentRef: Document;

  const hostQuerySelector = `div.${OVERLAY_HOST_CLASSNAME}`;
  const overlayQuerySelector = `div.${DIALOG_OVERLAY_CLASSNAME}`;

  beforeEach(() => {
    if (!document.body) {
      document.body = document.createElement('body');
    }

    installPopoverPolyfillIfMissing();

    TestBed.configureTestingModule({
      providers: [OverlayService],
    });
    service = TestBed.inject(OverlayService);
    documentRef = TestBed.inject(DOCUMENT);

    viewContainerRef = {
      createComponent: (cmp: any) => {
        const el = document.createElement('div');
        el.textContent = 'mock component content';
        return {
          instance: {},
          location: { nativeElement: el },
          destroy: vi.fn(),
        } as any;
      },
    } as any;
  });

  afterEach(() => {
    if (document.body) {
      document.body.innerHTML = '';
    }
    vi.restoreAllMocks();
    document.querySelectorAll(hostQuerySelector).forEach((el) => el.remove());
  });

  // ---------------------------
  // CREATE / DESTROY
  // ---------------------------
  it('should create dialog overlay elements', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const dialog = document.querySelector(overlayQuerySelector);
    expect(dialog).toBeTruthy();
    expect(ref.nativeElement).toBe(dialog);

    ref.close();

    expect(document.querySelector(overlayQuerySelector)).toBeFalsy();
  });

  it('should destroy component and remove DOM', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const host = document.querySelector(hostQuerySelector);
    expect(host?.textContent).toContain('mock component content');

    ref.close();

    expect(document.querySelector(hostQuerySelector)).toBeFalsy();
  });

  // ---------------------------
  // POPOVER API
  // ---------------------------
  it('should use popover on the host element by default', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const host = document.querySelector(hostQuerySelector) as HTMLElement;
    expect(host.getAttribute('popover')).toBe('manual');
    expect(host.matches(':popover-open')).toBe(true);

    ref.close();
  });

  it('should not set popover when usePopover is false', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      usePopover: false,
    });

    const host = document.querySelector(hostQuerySelector) as HTMLElement;
    expect(host.hasAttribute('popover')).toBe(false);

    ref.close();
  });

  it('should hide the popover on close without throwing', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const host = document.querySelector(hostQuerySelector) as HTMLElement;
    expect(() => ref.close()).not.toThrow();
    expect(host.matches(':popover-open')).toBe(false);
  });

  it('should not throw InvalidStateError when repositioning an already-open popover', async () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(() => {
      window.dispatchEvent(new Event('resize'));
      documentRef.dispatchEvent(new Event('scroll'));
    }).not.toThrow();

    ref.close();
  });

  it('should keep separate overlays independently closable (no global-listener leak)', async () => {
    const a1 = document.createElement('button');
    const a2 = document.createElement('button');
    document.body.appendChild(a1);
    document.body.appendChild(a2);

    const r1 = service.open({ anchor: a1, component: MockComponent, viewContainerRef });
    const r2 = service.open({ anchor: a2, component: MockComponent, viewContainerRef });

    await new Promise((resolve) => setTimeout(resolve, 20));

    r1.close();

    // r2 must still respond to Escape - this used to fail because closing r1
    // wiped the shared document-level listeners entirely.
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(document.querySelectorAll(hostQuerySelector).length).toBe(0);
  });

  // ---------------------------
  // BACKDROP CLICK
  // ---------------------------
  it('should close on backdrop click', async () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const host = document.querySelector(hostQuerySelector) as HTMLElement;
    const backdrop = host.querySelector<HTMLElement>('.ngx-ui-overlay-backdrop');
    expect(backdrop).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 500));

    backdrop!.click();

    expect(document.querySelector(hostQuerySelector)).toBeFalsy();
  });

  // ---------------------------
  // ESCAPE KEY
  // ---------------------------
  it('should close on escape key', async () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(document.querySelector(hostQuerySelector)).toBeFalsy();
  });

  // ---------------------------
  // RTL / LTR
  // ---------------------------
  it('should respect RTL layout', () => {
    document.documentElement.dir = 'rtl';
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '100px';
    anchor.style.left = '100px';
    document.body.appendChild(anchor);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'start',
    });

    const dialog = document.querySelector(overlayQuerySelector) as HTMLElement;
    expect(dialog).toBeTruthy();

    const rect = dialog.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);

    ref.close();
    document.documentElement.dir = 'ltr';
  });

  it('should respect LTR layout', () => {
    document.documentElement.dir = 'ltr';
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '100px';
    anchor.style.right = '100px';
    document.body.appendChild(anchor);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'end',
    });

    const dialog = document.querySelector(overlayQuerySelector) as HTMLElement;
    expect(dialog).toBeTruthy();

    const rect = dialog.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);

    ref.close();
  });

  // ---------------------------
  // VIEWPORT EDGE CASES
  // ---------------------------
  it('should not overflow viewport', () => {
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '0';
    anchor.style.left = '0';
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    const dialog = document.querySelector(overlayQuerySelector) as HTMLElement;
    const rect = dialog.getBoundingClientRect();

    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.top).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);

    ref.close();
  });

  // ---------------------------
  // SCROLL CONTAINER
  // ---------------------------
  it('should reposition on scroll container scroll', () => {
    const container = document.createElement('div');
    container.style.height = '200px';
    container.style.overflow = 'auto';
    const anchor = document.createElement('button');
    anchor.style.position = 'absolute';
    anchor.style.top = '150px';
    container.appendChild(anchor);
    document.body.appendChild(container);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));

    const dialog = document.querySelector(overlayQuerySelector);
    expect(dialog).toBeTruthy();

    ref.close();
  });

  // ---------------------------
  // WINDOW RESIZE
  // ---------------------------
  it('should reposition on resize', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    window.dispatchEvent(new Event('resize'));

    expect(document.querySelector(overlayQuerySelector)).toBeTruthy();

    ref.close();
  });

  // ---------------------------
  // MULTIPLE OVERLAYS
  // ---------------------------
  it('should support multiple dialogs', () => {
    const a1 = document.createElement('button');
    const a2 = document.createElement('button');
    document.body.appendChild(a1);
    document.body.appendChild(a2);

    const r1 = service.open({ anchor: a1, component: MockComponent, viewContainerRef });
    const r2 = service.open({ anchor: a2, component: MockComponent, viewContainerRef });
    expect(document.querySelectorAll(hostQuerySelector).length).toBe(2);

    r1.close();

    expect(document.querySelectorAll(hostQuerySelector).length).toBe(1);
    r2.close();
  });

  // ---------------------------
  // MEMORY LEAK / CLEANUP
  // ---------------------------
  it('should cleanup listeners after close', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    ref.close();

    const event = new Event('resize');
    expect(() => window.dispatchEvent(event)).not.toThrow();
  });

  // ---------------------------
  // SHADOW DOM
  // ---------------------------
  it('should work with shadow DOM anchor', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const anchor = document.createElement('button');
    shadow.appendChild(anchor);
    document.body.appendChild(host);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    expect(document.querySelector(hostQuerySelector)).toBeTruthy();
    ref.close();
  });

  // ---------------------------
  // RACE CONDITION
  // ---------------------------
  it('should not crash on rapid open/close', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    ref.close();

    const ref2 = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    expect(document.querySelector(hostQuerySelector)).toBeTruthy();
    ref2.close();
  });

  it('should not throw when two overlays open in the same tick (listener race)', () => {
    const a1 = document.createElement('button');
    const a2 = document.createElement('button');
    document.body.appendChild(a1);
    document.body.appendChild(a2);

    expect(() => {
      const r1 = service.open({ anchor: a1, component: MockComponent, viewContainerRef });
      const r2 = service.open({ anchor: a2, component: MockComponent, viewContainerRef });
      r1.close();
      r2.close();
    }).not.toThrow();
  });

  it('should view dialog in viewport', async () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 768,
    });
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'center',
      placement: 'bottom',
    });

    const dialog = document.querySelector<HTMLElement>(overlayQuerySelector);
    expect(dialog).toBeTruthy();

    ref.close();
  });

  // ---------------------------
  // viewContainerRef
  // ---------------------------
  it('should throw when viewContainerRef is missing', () => {
    expect(() =>
      service.open({
        anchor: document.createElement('button'),
        component: MockComponent,
        viewContainerRef: undefined as any,
      }),
    ).toThrow('OverlayService] ViewContainerRef is required.');
  });

  // ---------------------------
  // Resize window
  // ---------------------------
  it('should call positionOverlay on window resize', async () => {
    const spy2 = vi.spyOn(service as any, 'positionOverlay');
    const anchor = document.createElement('button');
    const ref = service.open({
      anchor,
      viewContainerRef,
      component: MockComponent,
    });
    window.resizeTo(500, 500);
    window.dispatchEvent(new Event('resize'));

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(spy2).toHaveBeenCalled();

    ref.close();
  });

  it('should coalesce multiple resize events into one reposition', async () => {
    const repositionSpy = vi.spyOn(service as any, 'positionOverlay');

    const anchor = document.createElement('button');

    const ref = service.open({
      anchor,
      viewContainerRef,
      component: MockComponent,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(repositionSpy).toHaveBeenCalledTimes(2);

    ref.close();
  });
});
