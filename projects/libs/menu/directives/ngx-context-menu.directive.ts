import { Directive, OnDestroy, input, ApplicationRef, ElementRef } from '@angular/core';
import { OverlayRef, OverlayService, OverlayInstance } from 'ngx-kit/shared';
import { NgxMenuPanel } from '../components/ngx-menu/menu.component';

@Directive({
  selector: '[ngxContextMenu]',
  exportAs: 'ngxContextMenu',
})
export class NgxContextMenu implements OnDestroy {
  ngxContextMenu = input.required<NgxMenuPanel>();

  private containerRef?: OverlayRef<NgxMenuPanel>;

  // باید همون رفرنس تابعی که به addEventListener داده می‌شه رو نگه داریم و به
  // removeEventListener هم بدیم؛ قبلاً هر بار یک آرو فانکشن جدید ساخته می‌شد
  // که removeEventListener اصلاً نمی‌تونست تشخیص بده مال همون listener قبلیه،
  // پس listener هیچ‌وقت واقعاً حذف نمی‌شد (نشتی حافظه‌ی کامل directive + المنت).
  private readonly boundOnClick = (ev: PointerEvent) => this.onClick(ev);

  constructor(
    private el: ElementRef<HTMLElement>,
    private appRef: ApplicationRef,
    private overlayService: OverlayService,
  ) {
    el.nativeElement.addEventListener('contextmenu', this.boundOnClick);
  }

  ngOnDestroy(): void {
    this.destroyContainer();
    this.el.nativeElement.removeEventListener('contextmenu', this.boundOnClick);
  }

  onClick(ev: PointerEvent) {
    if (ev.currentTarget == this.el.nativeElement) {
      ev.stopPropagation();
      ev.preventDefault();
      this.toggleContainer(ev.clientX, ev.clientY);
    }
  }

  private toggleContainer(x: number, y: number) {
    if (this.containerRef) {
      this.destroyContainer();
      return;
    }
    const t = this.ngxContextMenu().template();
    if (!t) return;
    this.containerRef = this.overlayService.openTemplate({
      anchor: this.el.nativeElement,
      point: { x, y },
      template: t,
      appRef: this.appRef,
      alignment: 'start',
      placement: 'auto',
      onClosed: () => {
        this.containerRef = undefined;
        this.overlayService.closeAll();
      },
      configure: (instance: OverlayInstance, ref: OverlayRef<NgxMenuPanel>) => {
        this.ngxContextMenu().containerRef = ref;
      },
    });
  }

  private destroyContainer() {
    this.containerRef?.close();
    this.containerRef = undefined;
  }
}
