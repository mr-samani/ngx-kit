import {
  Directive,
  OnDestroy,
  HostListener,
  input,
  ApplicationRef,
  ElementRef,
} from '@angular/core';
import { OverlayRef, OverlayService } from 'ngx-kit/shared';
import { NgxMenuPanel } from '../components/ngx-menu/menu.component';

@Directive({
  selector: '[ngxContextMenu]',
  exportAs: 'ngxContextMenu',
})
export class NgxContextMenu implements OnDestroy {
  ngxContextMenu = input.required<NgxMenuPanel>();

  private containerRef?: OverlayRef<NgxMenuPanel>;

  constructor(
    private el: ElementRef,
    private appRef: ApplicationRef,
    private overlayService: OverlayService,
  ) {}

  ngOnDestroy(): void {
    this.destroyContainer();
  }

  @HostListener('contextmenu', ['$event'])
  onClick(ev: PointerEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.toggleContainer(ev.clientX, ev.clientY);
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
      },
    });
  }

  private destroyContainer() {
    this.containerRef?.close();
    this.containerRef = undefined;
  }
}
