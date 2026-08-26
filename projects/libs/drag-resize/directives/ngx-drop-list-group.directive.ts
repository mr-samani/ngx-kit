import { Directive, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';
export const NGX_DROPLIST_GROUP = new InjectionToken<NgxDropListGroup>('ngx-drop-list-group');
@Directive({
  selector: '[NgxDropListGroup],[ngxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup implements OnInit, OnDestroy {
  readonly _ref = new DropListGroupRef();
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this._ref.lists.clear();
  }
}
