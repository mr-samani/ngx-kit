import { Injectable, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayOptions, TemplateOptions } from './overlay-options';
import { OverlayRef } from './overlay-ref';
import { PlacementConfig } from './placement-config';
import { OverlayInstance } from './overlay-instance';
import { IsRtl } from '../utils/is-rtl';
export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export const DIALOG_OVERLAY_CLASSNAME = 'ngx-ui-overlay';

@Injectable({ providedIn: 'root' })
export class OverlayService implements OnDestroy {
  private readonly overlayStacks: OverlayInstance[] = [];

  private zIndexCounter = 1000;
  private listenersAttached = false;
  private resizeRafPending = false;

  private readonly doc = inject(DOCUMENT);
  private readonly abortController = new AbortController();

  ngOnDestroy(): void {
    this.closeAll();
    this.abortController.abort();
  }

  open<T>(options: OverlayOptions<T>): OverlayRef<T> {
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
      throw new Error('ViewContainerRef is required to render overlay content.');
    }

    this.attachGlobalListeners();

    const element = this.createDialogElement();
    const componentRef = viewContainerRef.createComponent(component);

    if (componentRef.location.nativeElement) {
      element.appendChild(componentRef.location.nativeElement);
    }

    const instance: OverlayInstance = {
      element,
      anchor,
      point,
      placementConfig: this.resolvePlacementConfig(placement, alignment, margin),
      componentRef,
      onClosed,
      rafId: null,
      focusTimeoutId: null,
      cleanup: () => {},
    };
    instance.cleanup = () => this.destroyInstance(instance);

    this.overlayStacks.push(instance);
    element.showModal();

    const ref = new OverlayRef(element, instance.cleanup, componentRef);
    configure?.(componentRef.instance, ref);

    this.scheduleInitialLayout(instance);

    return ref;
  }

  openTemplate(options: TemplateOptions): OverlayRef<any> {
    const { anchor, point, template, appRef, configure, onClosed, placement, alignment, margin } =
      options;

    this.attachGlobalListeners();

    const element = this.createDialogElement();
    const view = template.createEmbeddedView({});
    appRef.attachView(view);
    element.append(...view.rootNodes);

    const instance: OverlayInstance = {
      element,
      anchor,
      point,
      placementConfig: this.resolvePlacementConfig(placement, alignment, margin),
      embeddedView: view,
      appRef,
      onClosed,
      rafId: null,
      focusTimeoutId: null,
      cleanup: () => {},
    };
    instance.cleanup = () => this.destroyInstance(instance);

    this.overlayStacks.push(instance);
    element.showModal();

    const ref = new OverlayRef(element, instance.cleanup, undefined, template);
    configure?.(instance, ref);

    this.scheduleInitialLayout(instance);

    return ref;
  }

  closeAll(): void {
    // اسنپ‌شات می‌گیریم چون cleanup حین اجرا آرایه‌ی اصلی رو تغییر می‌ده
    [...this.overlayStacks].forEach((instance) => instance.cleanup());
  }

  // ---------------------------------------------------------------------
  // lifecycle
  // ---------------------------------------------------------------------

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

  private createDialogElement(): HTMLDialogElement {
    const element = this.doc.createElement('dialog');
    element.className = DIALOG_OVERLAY_CLASSNAME;
    const style = element.style;
    style.position = 'absolute';
    style.outline = 'none';
    style.padding = '0';
    style.margin = '0';
    style.border = 'none';
    style.background = 'transparent';
    style.maxWidth = '100vw';
    style.maxHeight = '100vh';
    style.overflow = 'visible';
    style.visibility = 'hidden';

    // شمارنده‌ی صعودی مستقل از تعداد فعلی دیالوگ‌های باز؛ در نسخه‌ی قبلی
    // با استفاده از openDialogs.size محاسبه می‌شد که بعد از بستن دیالوگ‌ها
    // می‌تونست باعث تکرار zIndex بین دو دیالوگ بشه.
    style.zIndex = `${++this.zIndexCounter}`;

    this.doc.body.appendChild(element);
    return element;
  }

  private scheduleInitialLayout(instance: OverlayInstance): void {
    instance.rafId = requestAnimationFrame(() => {
      instance.rafId = null;
      this.positionDialog(instance);
    });

    instance.focusTimeoutId = setTimeout(() => {
      instance.focusTimeoutId = null;
      const focusable = instance.element.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      focusable?.focus();
    }, 0);
  }

  private destroyInstance(instance: OverlayInstance): void {
    const index = this.overlayStacks.indexOf(instance);
    if (index === -1) return; // جلوگیری از پاک‌سازی دوباره

    this.overlayStacks.splice(index, 1);

    // لغو کارهای زمان‌بندی‌شده‌ای که هنوز اجرا نشدن (نشتی حافظه در نسخه‌ی قبلی)
    if (instance.rafId !== null) cancelAnimationFrame(instance.rafId);
    if (instance.focusTimeoutId !== null) clearTimeout(instance.focusTimeoutId);

    if (instance.componentRef) {
      instance.componentRef.location.nativeElement?.remove();
      instance.componentRef.destroy();
    }

    if (instance.embeddedView && instance.appRef) {
      instance.appRef.detachView(instance.embeddedView);
      instance.embeddedView.destroy();
    }

    instance.element.remove();
    instance.onClosed?.();
  }

  // ---------------------------------------------------------------------
  // global listeners (فقط یک‌بار در کل عمر سرویس attach می‌شن)
  // ---------------------------------------------------------------------

  private attachGlobalListeners(): void {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    const { signal } = this.abortController;

    this.doc.addEventListener('keydown', this.onGlobalKeyDown, { signal });
    window.addEventListener('resize', this.onGlobalResize, { signal, passive: true });
    this.doc.addEventListener('click', this.onGlobalPointerEvent, { signal });
    this.doc.addEventListener('contextmenu', this.onGlobalPointerEvent, { signal });
  }

  private readonly onGlobalKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    this.getLastDialog()?.cleanup();
  };

  private readonly onGlobalResize = (): void => {
    // چند رویداد resize پشت‌سرهم فقط یک reposition واقعی اجرا می‌کنن
    if (this.resizeRafPending) return;
    this.resizeRafPending = true;
    requestAnimationFrame(() => {
      this.resizeRafPending = false;
      this.repositionAll();
    });
  };

  private readonly onGlobalPointerEvent = (e: MouseEvent): void => {
    this.handleClickOnBackdrop(e);
  };

  private handleClickOnBackdrop(event: MouseEvent): void {
    const lastDialog = this.getLastDialog();
    if (!lastDialog || !lastDialog.element.open) return;
    // کلیک باید دقیقاً روی خودِ دیالوگ (بک‌دراپ) باشه، نه محتوای داخلش
    if (event.target !== lastDialog.element) return;

    // اگه فرم داخل دیالوگه، با کلیک بیرون بسته نشه
    if (lastDialog.element.querySelector('form')) return;

    const rect = lastDialog.element.getBoundingClientRect();
    const clickWasInsideDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.bottom &&
      rect.left <= event.clientX &&
      event.clientX <= rect.right;

    const anchRect = lastDialog.anchor.getBoundingClientRect();
    const clickWasInsideAnchor =
      anchRect.top <= event.clientY &&
      event.clientY <= anchRect.bottom &&
      anchRect.left <= event.clientX &&
      event.clientX <= anchRect.right;

    if (!clickWasInsideDialog) {
      if (event.type == 'contextmenu' && lastDialog.point && clickWasInsideAnchor) {
        event.preventDefault();
        lastDialog.point = {
          x: event.clientX,
          y: event.clientY,
        };
        this.positionDialog(lastDialog);
      } else {
        lastDialog.cleanup();
      }
    }
  }

  private getLastDialog(): OverlayInstance | undefined {
    return this.overlayStacks[this.overlayStacks.length - 1];
  }

  // ---------------------------------------------------------------------
  // positioning
  // ---------------------------------------------------------------------

  private repositionAll(): void {
    this.overlayStacks.forEach((instance) => {
      if (instance.element.isConnected) {
        this.positionDialog(instance);
      }
    });
  }

  private positionDialog(instance: OverlayInstance): void {
    const { anchor, element: dialog, placementConfig, point } = instance;
    const { placement, alignment, margin } = placementConfig;

    if (!dialog.isConnected) return;

    let anchorRect: DOMRect;
    if (point) {
      anchorRect = new DOMRect(point.x, point.y, 0, 0);
    } else {
      anchorRect = anchor.getBoundingClientRect();
    }
    const dialogRect = dialog.getBoundingClientRect();

    const vw = Math.min(document.body.clientWidth, window.innerWidth);
    const vh = Math.min(document.body.clientHeight, window.innerHeight);
    const isRTL = IsRtl();

    let top = 0;
    let left: number | 'auto' = 'auto';
    let right: number | 'auto' = 'auto';

    const spaceBelow = vh - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    let verticalPos: 'above' | 'bottom' = 'above';

    if (
      placement === 'bottom' ||
      (placement === 'auto' && spaceBelow >= dialogRect.height + margin)
    ) {
      top = anchorRect.bottom + margin;
      verticalPos = 'above';
      if (top + dialogRect.height > vh - margin) {
        top = vh - dialogRect.height - margin;
        verticalPos = 'bottom';
      }
    } else {
      top = anchorRect.top - dialogRect.height - margin;
      verticalPos = 'bottom';
      if (top > spaceAbove) {
        top = anchorRect.top + anchorRect.height + margin;
        verticalPos = 'above';
      }
    }

    if (alignment === 'center') {
      left = anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2;
    } else if (alignment === 'start') {
      if (isRTL) {
        right = vw - anchorRect.right;
      } else {
        left = anchorRect.left;
      }
    } else {
      left = isRTL ? anchorRect.left : anchorRect.right; //- dialogRect.width;
    }
    if (left !== 'auto') {
      left = Math.min(Math.max(left, margin), vw - dialogRect.width - margin);
    }
    if (right !== 'auto') {
      right = Math.min(Math.max(right, margin), vw - dialogRect.width - margin);
    }

    dialog.className = `${DIALOG_OVERLAY_CLASSNAME} tips-${verticalPos}`;
    dialog.style.top = `${top + window.scrollY}px`;
    dialog.style.left = left !== 'auto' ? `${left + window.scrollX}px` : 'auto';
    dialog.style.right = right !== 'auto' ? `${right + window.scrollX}px` : 'auto';
    dialog.style.transformOrigin = verticalPos == 'above' ? 'left top' : 'left bottom';
    // dialog.style.transform = 'none';
    dialog.style.visibility = 'visible';
    dialog.style.animation = 'menu-enter 120ms cubic-bezier(0, 0, 0.2, 1)';
  }
}
