import { AfterViewInit, Directive, ElementRef, inject, InjectionToken, OnDestroy } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';
import { DragDropService } from '../services/drag-drop.service';

export const NGX_DROPLIST_GROUP = new InjectionToken<DropListGroupRef>('ngx-drop-list-group');

@Directive({
  selector: '[NgxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup implements AfterViewInit, OnDestroy {
  _ref = new DropListGroupRef();
  private dragDropService = inject(DragDropService);

  constructor(elRef: ElementRef) {
    this._ref.el = elRef.nativeElement;
    this.dragDropService.dropListGroup.el = this._ref.el;
  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.dragDropService.clear();
  }
}
