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
import { OverlayRef, DialogService } from 'ngx-kit/shared';
import { NgxMenuPanel } from '../components/ngx-menu/menu.component';

@Directive({
  selector: '[NgxMenu],[ngxMenuTrigger]',
  exportAs: 'ngxMenuTrigger',
})
export class NgxMenu implements OnDestroy {
  ngxMenuTrigger = input.required<NgxMenuPanel>();

  private containerRef?: OverlayRef<NgxMenuPanel>;

  constructor(
    private el: ElementRef,
    private appRef: ApplicationRef,
    private dialogService: DialogService,
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
    const t = this.ngxMenuTrigger().template();
    if (!t) return;
    this.containerRef = this.dialogService.openTemplate({
      anchor: this.el.nativeElement,
      template: t,
      appRef: this.appRef,
      alignment: 'start',
      placement: 'auto',
      // configure: (instance, ref) => {
      //   debugger;
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
