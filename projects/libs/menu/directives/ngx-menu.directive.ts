import {
  Directive,
  OnDestroy,
  ElementRef,
  ViewContainerRef,
  HostListener,
  input,
  Type,
  ApplicationRef,
} from '@angular/core';
import { OverlayRef, OverlayService } from 'ngx-kit/shared';
import { NgxMenuPanel } from '../components/ngx-menu/menu.component';

@Directive({
  selector: '[ngxMenu]',
  exportAs: 'ngxMenu',
})
export class NgxMenu implements OnDestroy {
  ngxMenu = input.required<NgxMenuPanel>();

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
      alignment: 'start',
      placement: 'auto',
      // configure: (instance, ref) => {
      //   instance.overlay = ref.nativeElement;
      //   instance.open();
      //   // instance.closed.subscribe(() => ref.close());
      // },
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
