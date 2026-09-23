import { Directive, ElementRef, inject, InjectionToken, Injector, OnDestroy } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';

export const NGX_DROPLIST_GROUP = new InjectionToken<NgxDropListGroup>('ngx-drop-list-group');

/** Wrap several `ngxDropList`s to let items move freely between them. */
@Directive({
  selector: '[NgxDropListGroup],[ngxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
  exportAs: 'ngxDropListGroup',
})
export class NgxDropListGroup implements OnDestroy {
  readonly _ref = new DropListGroupRef();
  protected readonly el = inject(ElementRef<HTMLElement>);

  injector = inject(Injector);
  constructor() {
    this._ref.el = this.el.nativeElement;
  }
  ngOnDestroy(): void {
    this._ref.lists.clear();
  }
}
