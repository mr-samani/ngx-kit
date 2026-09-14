import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { OverlayOptions, TemplateOptions } from './overlay-options';
import { OverlayRef } from './overlay-ref';
import { PlacementConfig } from './placement-config';
import { DirectionService } from '../services/direction.service';

export const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const DIALOG_OVERLAY_CLASSNAME = 'ngx-ui-overlay';
export const OVERLAY_HOST_CLASSNAME = 'ngx-ui-overlay-host';

const BASE_Z_INDEX = 1000;

interface OverlayInstance<T = unknown> {
  host: HTMLElement;
  backdrop: HTMLElement;
  element: HTMLElement;
  anchor?: HTMLElement;
  point?: { x: number; y: number };
  placementConfig: PlacementConfig;
  /** resolved: true only if requested AND the browser actually supports it */
  usePopover: boolean;
  componentRef?: ComponentRef<T>;
  embeddedView?: EmbeddedViewRef<unknown>;
  appRef?: {
    attachView(view: EmbeddedViewRef<unknown>): void;
    detachView(view: EmbeddedViewRef<unknown>): void;
  };

  onClosed?: () => void;
  previousActiveElement: HTMLElement | null;
  rafId: number | null;
  focusTimeoutId: ReturnType<typeof setTimeout> | null;
  cleanup: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private readonly document = inject(DOCUMENT);
  private readonly directionService = inject(DirectionService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly overlayStack: OverlayInstance[] = [];
  private globalListenersAttached = false;
  private layoutRaf: number | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  open<T>(options: OverlayOptions<T>): OverlayRef<T> {
    if (!this.isBrowser) {
      return OverlayRef.noop<T>();
    }

    const {
      anchor,
      point,
      component,
      viewContainerRef,
      configure,
      onClosed,
      placement,
      alignment,
      margin,
      usePopover,
    } = options;
    if (!viewContainerRef) {
      throw new Error('[OverlayService] ViewContainerRef is required.');
    }
    const instance = this.createComponentInstance<T>(
      anchor,
      point,
      component,
      viewContainerRef,
      onClosed,
      placement,
      alignment,
      margin,
      this.resolveUsePopover(usePopover),
    );
    this.pushInstance(instance);
    this.renderHost(instance);
    configure?.(
      instance.componentRef!.instance,
      new OverlayRef(instance.element, instance.cleanup, instance.componentRef),
    );
    this.scheduleInitialLayout(instance);
    this.attachGlobalListeners();
    return new OverlayRef(instance.element, instance.cleanup, instance.componentRef);
  }

  openTemplate(options: TemplateOptions): OverlayRef<any> {
    if (!this.isBrowser) {
      return OverlayRef.noop();
    }
    const {
      anchor,
      point,
      template,
      appRef,
      configure,
      onClosed,
      placement,
      alignment,
      margin,
      usePopover,
    } = options;
    const instance = this.createTemplateInstance(
      anchor,
      point,
      template,
      appRef,
      onClosed,
      placement,
      alignment,
      margin,
      this.resolveUsePopover(usePopover),
    );
    this.pushInstance(instance);
    this.renderHost(instance);
    const ref = new OverlayRef(instance.element, instance.cleanup, undefined, template);
    configure?.(instance, ref);
    this.scheduleInitialLayout(instance);
    this.attachGlobalListeners();
    return ref;
  }

  closeAll(): void {
    if (!this.isBrowser) {
      return;
    }
    [...this.overlayStack].forEach((instance) => {
      instance.cleanup();
    });
  }

  // ---------------------------------------------------------------------------
  // instance creation
  // ---------------------------------------------------------------------------

  private createComponentInstance<T>(
    anchor: HTMLElement,
    point: { x: number; y: number } | undefined,
    component: any,
    viewContainerRef: ViewContainerRef,
    onClosed: (() => void) | undefined,
    placement: PlacementConfig['placement'] | undefined,
    alignment: PlacementConfig['alignment'] | undefined,
    margin: number | undefined,
    usePopover: boolean,
  ): OverlayInstance<T> {
    const host = this.createHostElement(usePopover);
    const backdrop = this.createBackdropElement();
    const element = this.createOverlayElement();

    host.appendChild(backdrop);
    host.appendChild(element);
    const componentRef = viewContainerRef.createComponent<T>(component);
    element.appendChild(componentRef.location.nativeElement);
    const instance: OverlayInstance<T> = {
      host,
      backdrop,
      element,
      anchor,
      point,
      placementConfig: this.resolvePlacementConfig(placement, alignment, margin),
      usePopover,
      componentRef,
      onClosed,
      previousActiveElement: this.getActiveElement(),
      rafId: null,
      focusTimeoutId: null,
      cleanup: () => {},
    };
    instance.cleanup = () => this.destroyInstance(instance);
    return instance;
  }

  private createTemplateInstance(
    anchor: HTMLElement | undefined,
    point: { x: number; y: number } | undefined,
    template: TemplateRef<unknown>,
    appRef: any,
    onClosed: (() => void) | undefined,
    placement: PlacementConfig['placement'] | undefined,
    alignment: PlacementConfig['alignment'] | undefined,
    margin: number | undefined,
    usePopover: boolean,
  ): OverlayInstance {
    const host = this.createHostElement(usePopover);
    const backdrop = this.createBackdropElement();
    const element = this.createOverlayElement();
    host.appendChild(backdrop);
    host.appendChild(element);
    const view = template.createEmbeddedView({});
    appRef.attachView(view);
    element.append(...view.rootNodes);
    const instance: OverlayInstance = {
      host,
      backdrop,
      element,
      anchor,
      point,
      placementConfig: this.resolvePlacementConfig(placement, alignment, margin),
      usePopover,
      embeddedView: view,
      appRef,
      onClosed,
      previousActiveElement: this.getActiveElement(),
      rafId: null,
      focusTimeoutId: null,
      cleanup: () => {},
    };
    instance.cleanup = () => this.destroyInstance(instance);
    return instance;
  }

  private pushInstance(instance: OverlayInstance): void {
    this.overlayStack.push(instance);
    // Only matters as a fallback for browsers without the Popover API -
    // real popovers stack by top-layer show order regardless of z-index.
    instance.host.style.zIndex = String(BASE_Z_INDEX + this.overlayStack.length);
  }

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------

  private createHostElement(usePopover: boolean): HTMLElement {
    const host = this.document.createElement('div');
    host.className = OVERLAY_HOST_CLASSNAME;
    host.setAttribute('data-ngx-overlay', '');
    host.style.position = 'fixed';
    host.style.inset = '0';
    // Neutralize the browser's default `[popover]` UA stylesheet
    // (margin: auto; width/height: fit-content; border: solid; padding: .25em;
    // background: Canvas; overflow: auto) so the host reliably fills the
    // viewport whether or not it ends up being a real popover.
    host.style.margin = '0';
    host.style.padding = '0';
    host.style.border = 'none';
    host.style.width = '100%';
    host.style.height = '100%';
    host.style.maxWidth = 'none';
    host.style.maxHeight = 'none';
    host.style.overflow = 'visible';
    host.style.background = 'transparent';
    host.style.color = 'inherit';
    host.style.zIndex = String(BASE_Z_INDEX);
    host.style.pointerEvents = 'auto';

    // Popover goes on the ROOT element, not the inner panel. This puts the
    // whole overlay (backdrop + panel) in the top layer as a single unit,
    // so stacking "just works" above everything on the page - including
    // ancestors with `overflow: hidden`, `transform`, or their own z-index
    // stacking contexts, which regular `position: fixed` cannot escape.
    // The inner `element` stays a normal `position: fixed` div and keeps
    // computing against the viewport, so all the placement math is unchanged.
    if (usePopover) {
      host.setAttribute('popover', 'manual');
    }

    return host;
  }

  private createBackdropElement(): HTMLElement {
    const backdrop = this.document.createElement('div');
    backdrop.className = 'ngx-ui-overlay-backdrop';
    backdrop.style.position = 'absolute';
    backdrop.style.inset = '0';
    backdrop.style.pointerEvents = 'auto';
    backdrop.style.background = 'transparent';
    return backdrop;
  }

  private createOverlayElement(): HTMLElement {
    const element = this.document.createElement('div');
    element.className = DIALOG_OVERLAY_CLASSNAME;
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('tabindex', '-1');
    element.style.position = 'fixed';
    element.style.pointerEvents = 'auto';
    element.style.boxSizing = 'border-box';
    element.style.maxWidth = 'calc(100vw - 16px)';
    element.style.maxHeight = 'calc(100vh - 16px)';
    element.style.outline = 'none';
    element.style.border = 'none';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.overflow = 'auto';
    element.style.transformOrigin = 'left top';
    return element;
  }

  private renderHost(instance: OverlayInstance): void {
    this.document.body.appendChild(instance.host);
    // Must show the popover (enter the top layer) BEFORE we ever measure
    // `instance.element`'s rect - while a popover host is closed it's
    // `display: none`, and everything inside it (including the panel)
    // would measure as a 0x0 box.
    this.showHostPopover(instance);
    instance.element.style.visibility = 'hidden';
    instance.element.style.position = 'fixed';
    instance.element.style.top = '0';
    instance.element.style.left = '0';
  }

  // ---------------------------------------------------------------------------
  // lifecycle
  // ---------------------------------------------------------------------------

  private destroyInstance(instance: OverlayInstance): void {
    const index = this.overlayStack.indexOf(instance);
    if (index === -1) {
      return;
    }
    this.overlayStack.splice(index, 1);
    if (instance.rafId !== null) {
      this.cancelAnimationFrame(instance.rafId);
      instance.rafId = null;
    }
    if (instance.focusTimeoutId !== null) {
      clearTimeout(instance.focusTimeoutId);
      instance.focusTimeoutId = null;
    }
    if (instance.componentRef) {
      instance.componentRef.destroy();
      instance.componentRef = undefined;
    }
    if (instance.embeddedView && instance.appRef) {
      instance.appRef.detachView(instance.embeddedView);
      instance.embeddedView.destroy();
      instance.embeddedView = undefined;
    }
    this.hideHostPopover(instance);
    instance.host.remove();
    instance.onClosed?.();
    // Only tear down the shared/global listeners once *every* overlay is
    // closed - previously this ran unconditionally on every close, which
    // silently broke Escape/outside-click/reposition for any overlays that
    // were still open underneath.
    if (this.overlayStack.length === 0) {
      this.detachGlobalListeners();
    }
    this.restoreFocus(instance.previousActiveElement);
  }

  // ---------------------------------------------------------------------------
  // popover helpers
  // ---------------------------------------------------------------------------

  private resolveUsePopover(requested: boolean | undefined): boolean {
    return (requested ?? true) && this.supportsPopover();
  }

  private showHostPopover(instance: OverlayInstance): void {
    if (!instance.usePopover) {
      return;
    }
    try {
      instance.host.showPopover();
    } catch {
      // Already open, or environment doesn't fully support it - ignore.
    }
  }

  private hideHostPopover(instance: OverlayInstance): void {
    if (!instance.usePopover) {
      return;
    }
    try {
      if (instance.host.matches(':popover-open')) {
        instance.host.hidePopover();
      }
    } catch {
      // Not open, or already removed from the DOM - ignore.
    }
  }

  private supportsPopover(): boolean {
    return (
      typeof HTMLElement !== 'undefined' &&
      'popover' in HTMLElement.prototype &&
      typeof HTMLElement.prototype.showPopover === 'function' &&
      typeof HTMLElement.prototype.hidePopover === 'function'
    );
  }

  // ---------------------------------------------------------------------------
  // global listeners
  // ---------------------------------------------------------------------------

  private attachGlobalListeners(): void {
    if (!this.isBrowser || this.globalListenersAttached) {
      return;
    }
    // Flip the flag synchronously to avoid a race: if two overlays open in
    // the same tick, the second call must see the flag already set instead
    // of scheduling a second (duplicate) round of addEventListener calls.
    this.globalListenersAttached = true;
    setTimeout(() => {
      this.document.addEventListener('keydown', this.onDocumentKeydown);
      this.document.addEventListener('click', this.onDocumentClick);
      this.document.addEventListener('contextmenu', this.onDocumentContextMenu);
      this.document.addEventListener('scroll', this.onDocumentScroll, true);
      window.addEventListener('resize', this.onWindowResize);
    }, 0);
  }

  private detachGlobalListeners(): void {
    if (!this.isBrowser || !this.globalListenersAttached) {
      return;
    }
    this.globalListenersAttached = false;
    this.document.removeEventListener('keydown', this.onDocumentKeydown);
    this.document.removeEventListener('click', this.onDocumentClick);
    this.document.removeEventListener('contextmenu', this.onDocumentContextMenu);
    this.document.removeEventListener('scroll', this.onDocumentScroll, true);
    window.removeEventListener('resize', this.onWindowResize);
  }

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    const instance = this.getLastInstance();
    if (!instance) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      instance.cleanup();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event, instance);
    }
  };

  private readonly onDocumentClick = (event: MouseEvent): void => {
    const instance = this.getLastInstance();
    if (!instance) {
      return;
    }
    const target = event.target as Node | null;
    if (!target) {
      return;
    }
    if (instance.element.contains(target)) {
      return;
    }
    if (instance.anchor && instance.anchor.contains(target)) {
      return;
    }
    instance.cleanup();
  };

  private readonly onDocumentContextMenu = (event: MouseEvent): void => {
    const instance = this.getLastInstance();
    if (!instance) {
      return;
    }
    if (instance.point && instance.anchor && instance.anchor.contains(event.target as Node)) {
      event.preventDefault();
      instance.point = {
        x: event.clientX,
        y: event.clientY,
      };
      this.scheduleReposition();
      return;
    }
    if (instance.element.contains(event.target as Node)) {
      return;
    }
    instance.cleanup();
  };

  private readonly onDocumentScroll = (): void => {
    this.scheduleReposition();
  };

  private readonly onWindowResize = (): void => {
    this.scheduleReposition();
  };

  private scheduleReposition(): void {
    if (this.layoutRaf !== null) {
      return;
    }
    this.layoutRaf = this.requestAnimationFrame(() => {
      this.layoutRaf = null;
      const instances = [...this.overlayStack];
      for (const instance of instances) {
        this.positionOverlay(instance);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // focus
  // ---------------------------------------------------------------------------

  private scheduleInitialLayout(instance: OverlayInstance): void {
    instance.rafId = this.requestAnimationFrame(() => {
      instance.rafId = null;
      this.positionOverlay(instance);
      instance.focusTimeoutId = setTimeout(() => {
        instance.focusTimeoutId = null;
        this.focusInitialElement(instance);
      }, 0);
    });
  }

  private focusInitialElement(instance: OverlayInstance): void {
    const focusable = instance.element.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.focus() ?? instance.element.focus();
  }

  private trapFocus(event: KeyboardEvent, instance: OverlayInstance): void {
    const elements = Array.from(instance.element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (!elements.length) {
      event.preventDefault();
      instance.element.focus();
      return;
    }
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.getActiveElement();
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  }

  private restoreFocus(element: HTMLElement | null): void {
    if (element && element.isConnected) {
      setTimeout(() => {
        element.focus();
      }, 0);
    }
  }

  private getActiveElement(): HTMLElement | null {
    const active = this.document.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  // ---------------------------------------------------------------------------
  // positioning
  // ---------------------------------------------------------------------------

  private positionOverlay(instance: OverlayInstance): void {
    if (!instance.host.isConnected || !instance.element.isConnected) {
      return;
    }
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const anchorRect = this.getAnchorRect(instance);
    const overlay = instance.element;
    const overlayRect = overlay.getBoundingClientRect();
    const { placement, alignment, margin } = instance.placementConfig;
    const isRTL = this.directionService.isRtl();
    const spaceBelow = viewportHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    const placeBelow =
      placement === 'bottom' || (placement === 'auto' && spaceBelow >= overlayRect.height + margin);
    let top: number;
    if (placeBelow) {
      top = anchorRect.bottom + margin;
    } else {
      top = anchorRect.top - overlayRect.height - margin;
    }
    if (top + overlayRect.height > viewportHeight - margin) {
      top = viewportHeight - overlayRect.height - margin;
    }
    if (top < margin) {
      top = margin;
    }
    let left: number;
    switch (alignment) {
      case 'center':
        left = anchorRect.left + anchorRect.width / 2 - overlayRect.width / 2;
        break;
      case 'end':
        left = isRTL ? anchorRect.left : anchorRect.right - overlayRect.width;
        break;
      case 'start':
      default:
        left = isRTL ? anchorRect.right - overlayRect.width : anchorRect.left;
        break;
    }
    left = Math.min(
      Math.max(left, margin),
      Math.max(margin, viewportWidth - overlayRect.width - margin),
    );
    overlay.style.top = `${Math.round(top)}px`;
    overlay.style.left = `${Math.round(left)}px`;
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
    overlay.style.visibility = 'visible';
    overlay.classList.toggle('tips-below', placeBelow);
    overlay.classList.toggle('tips-above', !placeBelow);
    // NOTE: showPopover() is intentionally NOT called here. It already
    // happened once in renderHost(); calling it again on every reposition
    // (scroll/resize) throws InvalidStateError since the popover is
    // already open.
  }

  private getAnchorRect(instance: OverlayInstance): DOMRect {
    if (instance.point) {
      return new DOMRect(instance.point.x, instance.point.y, 0, 0);
    }
    if (instance.anchor && instance.anchor.isConnected) {
      return instance.anchor.getBoundingClientRect();
    }
    return new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0);
  }

  private resolvePlacementConfig(
    placement?: PlacementConfig['placement'],
    alignment?: PlacementConfig['alignment'],
    margin?: number,
  ): PlacementConfig {
    return {
      placement: placement ?? 'auto',
      alignment: alignment ?? 'start',
      margin: margin ?? 8,
    };
  }

  // ---------------------------------------------------------------------------
  // utilities
  // ---------------------------------------------------------------------------

  private getLastInstance(): OverlayInstance | undefined {
    return this.overlayStack[this.overlayStack.length - 1];
  }

  private requestAnimationFrame(callback: FrameRequestCallback): number {
    if (typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(callback);
    }
    return window.setTimeout(() => callback(Date.now()), 16) as unknown as number;
  }

  private cancelAnimationFrame(id: number): void {
    if (typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    }
  }
}
