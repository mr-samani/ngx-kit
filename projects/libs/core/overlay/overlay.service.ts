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

interface OverlayInstance<T = unknown> {
  host: HTMLElement;
  backdrop: HTMLElement;
  element: HTMLElement;
  anchor?: HTMLElement;
  point?: { x: number; y: number };
  placementConfig: PlacementConfig;
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
    );
    this.overlayStack.push(instance);
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
    const { anchor, point, template, appRef, configure, onClosed, placement, alignment, margin } =
      options;
    const instance = this.createTemplateInstance(
      anchor,
      point,
      template,
      appRef,
      onClosed,
      placement,
      alignment,
      margin,
    );
    this.overlayStack.push(instance);
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
    placement?: PlacementConfig['placement'],
    alignment?: PlacementConfig['alignment'],
    margin?: number,
  ): OverlayInstance<T> {
    const host = this.createHostElement();
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
    placement?: PlacementConfig['placement'],
    alignment?: PlacementConfig['alignment'],
    margin?: number,
  ): OverlayInstance {
    const host = this.createHostElement();
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

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------
  private createHostElement(): HTMLElement {
    const host = this.document.createElement('div');
    host.className = OVERLAY_HOST_CLASSNAME;
    host.setAttribute('data-ngx-overlay', '');
    host.style.position = 'fixed';
    host.style.inset = '0';
    host.style.zIndex = '1000';
    host.style.pointerEvents = 'auto';
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
    element.style.overflow = 'auto';
    element.style.transformOrigin = 'left top';

    return element;
  }

  private renderHost(instance: OverlayInstance): void {
    this.document.body.appendChild(instance.host);
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
    instance.host.remove();
    instance.onClosed?.();
    this.detachGlobalListerners();
    this.restoreFocus(instance.previousActiveElement);
  }

  // ---------------------------------------------------------------------------
  // global listeners
  // ---------------------------------------------------------------------------

  private attachGlobalListeners(): void {
    if (!this.isBrowser || this.globalListenersAttached) {
      return;
    }
    setTimeout(() => {
      this.globalListenersAttached = true;
      this.document.addEventListener('keydown', this.onDocumentKeydown);
      this.document.addEventListener('click', this.onDocumentClick);
      this.document.addEventListener('contextmenu', this.onDocumentContextMenu);
      this.document.addEventListener('scroll', this.onDocumentScroll, true);
      window.addEventListener('resize', this.onWindowResize);
    }, 0);
  }

  private detachGlobalListerners(): void {
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
    overlay.style.visibility = 'visible';
    overlay.classList.toggle('tips-below', placeBelow);
    overlay.classList.toggle('tips-above', !placeBelow);
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
