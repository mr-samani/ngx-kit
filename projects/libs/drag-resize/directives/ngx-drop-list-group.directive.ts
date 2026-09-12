import { Directive, InjectionToken, OnDestroy } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';

export const NGX_DROPLIST_GROUP = new InjectionToken<NgxDropListGroup>('ngx-drop-list-group');

/** Wrap several `ngxDropList`s to let items move freely between them. */
@Directive({
  selector: '[NgxDropListGroup],[ngxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup implements OnDestroy {
  readonly _ref = new DropListGroupRef();
  ngOnDestroy(): void {
    this._ref.lists.clear();
  }
}
