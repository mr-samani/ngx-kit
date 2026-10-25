import {
  Directive,
  OnDestroy,
  ElementRef,
  HostListener,
  input,
  ApplicationRef,
  inject,
} from '@angular/core';
import { OverlayRef, OverlayService, OverlayInstance, Alignment, Placement } from 'ngx-kit/core';
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

  protected readonly overlay = inject(OverlayService);
  protected readonly appRef = inject(ApplicationRef);
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {}

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
    this.containerRef = this.overlay.openTemplate({
      anchor: this.el.nativeElement,
      template: t,
      appRef: this.appRef,
      alignment: this.alignment() ?? 'start',
      placement: this.placement() ?? 'auto',
      panelClass: 'ngx-menu-overlay',
      onClosed: () => {
        this.containerRef = undefined;
        this.overlay.closeAll();
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
