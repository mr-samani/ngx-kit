import {
  Directive,
  OnDestroy,
  ElementRef,
  HostListener,
  input,
  ApplicationRef,
} from '@angular/core';
import { OverlayRef, OverlayService, OverlayInstance, Alignment, Placement } from 'ngx-kit/shared';
import { NgxMenuPanel } from '../components/ngx-menu/menu.component';

@Directive({
  selector: '[ngxMenu]',
  exportAs: 'ngxMenu',
})
export class NgxMenu implements OnDestroy {
  ngxMenu = input.required<NgxMenuPanel>();
  placement = input<Placement>();
  alignment = input<Alignment>();

  private containerRef?: OverlayRef<NgxMenuPanel>;

  constructor(
    private el: ElementRef,
    private appRef: ApplicationRef,
    private overlayService: OverlayService,
  ) {}

  ngOnDestroy(): void {
    this.destroyContainer();
  }

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    this.toggleContainer();
  }

  private toggleContainer() {
    if (this.containerRef) {
      this.destroyContainer();
      return;
    }
    const t = this.ngxMenu().template();
    if (!t) return;
    this.containerRef = this.overlayService.openTemplate({
      anchor: this.el.nativeElement,
      template: t,
      appRef: this.appRef,
      alignment: this.alignment() ?? 'start',
      placement: this.placement() ?? 'auto',
      onClosed: () => {
        this.containerRef = undefined;
        this.overlayService.closeAll();
      },
      configure: (instance: OverlayInstance, ref: OverlayRef<NgxMenuPanel>) => {
        this.ngxMenu().containerRef = ref;
      },
    });
  }

  private destroyContainer() {
    this.containerRef?.close();
    this.containerRef = undefined;
  }
}
