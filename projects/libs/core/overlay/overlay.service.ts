import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  createComponent,
  inject,
} from '@angular/core';

import { Alignment, OverlayOptions, Placement, TemplateOptions } from './overlay-options';
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

  usePopover: boolean;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  canClose?: () => boolean;
  autoFocus: boolean;
  restoreFocus: boolean;
  lockBodyScroll: boolean;

  componentRef?: ComponentRef<T>;
  /** true when `componentRef` was attached directly to the ApplicationRef
   *  (no ViewContainerRef supplied) and therefore needs an explicit detach. */
  attachedToAppRef?: boolean;
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
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly overlayStack: OverlayInstance[] = [];
  private globalListenersAttached = false;
  private layoutRaf: number | null = null;

  private bodyScrollLockCount = 0;
  private previousBodyOverflow: string | null = null;
  private previousBodyPaddingRight: string | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Number of overlays currently open. */
  get openCount(): number {
    return this.overlayStack.length;
  }

  open<T>(options: OverlayOptions<T>): OverlayRef<T> {
    if (!this.isBrowser) {
      return OverlayRef.noop<T>();
    }

    const { component, viewContainerRef, configure, onClosed } = options;
    const instance = this.createComponentInstance<T>(options, component, viewContainerRef);
    this.pushInstance(instance);
    this.renderHost(instance);
    instance.onClosed = onClosed;
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
    const { template, appRef, configure, onClosed } = options;
    const instance = this.createTemplateInstance(options, template, appRef ?? this.applicationRef);
    this.pushInstance(instance);
    this.renderHost(instance);
    instance.onClosed = onClosed;
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
    options: OverlayOptions<T>,
    component: OverlayOptions<T>['component'],
    viewContainerRef: ViewContainerRef | undefined,
  ): OverlayInstance<T> {
    const host = this.createHostElement(options);
    const backdrop = this.createBackdropElement(options);
    const element = this.createOverlayElement(options);

    host.appendChild(backdrop);
    host.appendChild(element);

    let componentRef: ComponentRef<T>;
    let attachedToAppRef = false;
    if (viewContainerRef) {
      componentRef = options.injector
        ? viewContainerRef.createComponent<T>(component, { injector: options.injector })
        : viewContainerRef.createComponent<T>(component);
    } else {
      // No host ViewContainerRef available (e.g. a global service opening an
      // overlay outside of any component template) - create and attach the
      // component directly against the application, like a root component.
      componentRef = createComponent<T>(component, {
        environmentInjector: this.environmentInjector,
        elementInjector: options.injector,
      });
      this.applicationRef.attachView(componentRef.hostView);
      attachedToAppRef = true;
    }
    element.appendChild(componentRef.location.nativeElement);

    const instance: OverlayInstance<T> = {
      host,
      backdrop,
      element,
      anchor: options.anchor,
      point: options.point,
      placementConfig: this.resolvePlacementConfig(
        options.placement,
        options.alignment,
        options.margin,
      ),
      usePopover: this.resolveUsePopover(options),
      closeOnEscape: options.closeOnEscape ?? true,
      closeOnOutsideClick: options.closeOnOutsideClick ?? true,
      canClose: options.canClose,
      autoFocus: options.autoFocus ?? true,
      restoreFocus: options.restoreFocus ?? true,
      lockBodyScroll: options.lockBodyScroll ?? false,
      componentRef,
      attachedToAppRef,
      previousActiveElement: this.getActiveElement(),
      rafId: null,
      focusTimeoutId: null,
      cleanup: () => {},
    };
    instance.cleanup = () => this.destroyInstance(instance);
    return instance;
  }

  private createTemplateInstance(
    options: TemplateOptions,
    template: TemplateRef<unknown>,
    appRef: {
      attachView(view: EmbeddedViewRef<unknown>): void;
      detachView(view: EmbeddedViewRef<unknown>): void;
    },
  ): OverlayInstance {
    const host = this.createHostElement(options);
    const backdrop = this.createBackdropElement(options);
    const element = this.createOverlayElement(options);
    host.appendChild(backdrop);
    host.appendChild(element);
    const view = template.createEmbeddedView({});
    appRef.attachView(view);
    element.append(...view.rootNodes);
    const instance: OverlayInstance = {
      host,
      backdrop,
      element,
      anchor: options.anchor,
      point: options.point,
      placementConfig: this.resolvePlacementConfig(
        options.placement,
        options.alignment,
        options.margin,
      ),
      usePopover: this.resolveUsePopover(options),
      closeOnEscape: options.closeOnEscape ?? true,
      closeOnOutsideClick: options.closeOnOutsideClick ?? true,
      canClose: options.canClose,
      autoFocus: options.autoFocus ?? true,
      restoreFocus: options.restoreFocus ?? true,
      lockBodyScroll: options.lockBodyScroll ?? false,
      embeddedView: view,
      appRef,
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
    if (instance.lockBodyScroll) {
      this.lockBodyScroll();
    }
  }

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------

  private createHostElement(options: { usePopover?: boolean }): HTMLElement {
    const usePopover = this.resolveUsePopover(options);
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

  private createBackdropElement(options: { backdropClass?: string | string[] }): HTMLElement {
    const backdrop = this.document.createElement('div');
    backdrop.className = 'ngx-ui-overlay-backdrop';
    backdrop.style.position = 'absolute';
    backdrop.style.inset = '0';
    backdrop.style.pointerEvents = 'auto';
    backdrop.style.background = 'transparent';
    this.addClasses(backdrop, options.backdropClass);
    return backdrop;
  }

  private createOverlayElement(options: {
    panelClass?: string | string[];
    role?: string;
    ariaModal?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
  }): HTMLElement {
    const element = this.document.createElement('div');
    element.className = DIALOG_OVERLAY_CLASSNAME;
    element.setAttribute('role', options.role ?? 'dialog');
    if (options.ariaModal ?? true) {
      element.setAttribute('aria-modal', 'true');
    }
    if (options.ariaLabel) {
      element.setAttribute('aria-label', options.ariaLabel);
    }
    if (options.ariaLabelledby) {
      element.setAttribute('aria-labelledby', options.ariaLabelledby);
    }
    if (options.ariaDescribedby) {
      element.setAttribute('aria-describedby', options.ariaDescribedby);
    }
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
    this.addClasses(element, options.panelClass);
    return element;
  }

  private addClasses(element: HTMLElement, classes: string | string[] | undefined): void {
    if (!classes) {
      return;
    }
    const list = Array.isArray(classes) ? classes : classes.split(' ');
    for (const c of list) {
      if (c.trim()) {
        element.classList.add(c.trim());
      }
    }
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
      if (instance.attachedToAppRef) {
        this.applicationRef.detachView(instance.componentRef.hostView);
      }
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
    if (instance.lockBodyScroll) {
      this.unlockBodyScroll();
    }
    instance.onClosed?.();
    // Only tear down the shared/global listeners once *every* overlay is
    // closed - previously this ran unconditionally on every close, which
    // silently broke Escape/outside-click/reposition for any overlays that
    // were still open underneath.
    if (this.overlayStack.length === 0) {
      this.detachGlobalListeners();
    }
    if (instance.restoreFocus) {
      this.restoreFocus(instance.previousActiveElement);
    }
  }

  // ---------------------------------------------------------------------------
  // popover helpers
  // ---------------------------------------------------------------------------

  private resolveUsePopover(options: { usePopover?: boolean }): boolean {
    return (options.usePopover ?? true) && this.supportsPopover();
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
  // body scroll lock
  // ---------------------------------------------------------------------------

  private lockBodyScroll(): void {
    this.bodyScrollLockCount++;
    if (this.bodyScrollLockCount > 1) {
      return;
    }
    const body = this.document.body;
    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - this.document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
  }

  private unlockBodyScroll(): void {
    if (this.bodyScrollLockCount === 0) {
      return;
    }
    this.bodyScrollLockCount--;
    if (this.bodyScrollLockCount > 0) {
      return;
    }
    const body = this.document.body;
    body.style.overflow = this.previousBodyOverflow ?? '';
    body.style.paddingRight = this.previousBodyPaddingRight ?? '';
    this.previousBodyOverflow = null;
    this.previousBodyPaddingRight = null;
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
      if (!instance.closeOnEscape || (instance.canClose && !instance.canClose())) {
        return;
      }
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
    if (!instance.closeOnOutsideClick || (instance.canClose && !instance.canClose())) {
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
    if (!instance.closeOnOutsideClick || (instance.canClose && !instance.canClose())) {
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
      if (!instance.autoFocus) {
        return;
      }
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

    let top: number;
    if (placement === 'center') {
      top = anchorRect.top + anchorRect.height / 2 - overlayRect.height / 2;
    } else {
      const spaceBelow = viewportHeight - anchorRect.bottom;
      const placeBelow =
        placement === 'bottom' ||
        (placement === 'auto' && spaceBelow >= overlayRect.height + margin);
      if (placeBelow) {
        top = anchorRect.bottom + margin;
      } else {
        top = anchorRect.top - overlayRect.height - margin;
      }
      overlay.classList.toggle('tips-below', placeBelow);
      overlay.classList.toggle('tips-above', !placeBelow);
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
    placement?: Placement,
    alignment?: Alignment,
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
