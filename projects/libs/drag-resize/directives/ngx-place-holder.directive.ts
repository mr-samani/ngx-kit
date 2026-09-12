import { Directive, InjectionToken, TemplateRef, inject } from '@angular/core';
import { PlaceHolderRef } from '../placeholder-ref';
import { NGX_DROPLIST } from './ngx-drop-list.directive';

export const NGX_PLACEHOLDER = new InjectionToken<PlaceHolderRef>('ngx-place-holder');

@Directive({
  selector: '[NgxPlaceholder],[ngxPlaceholder]',
  providers: [{ provide: NGX_PLACEHOLDER, useExisting: NgxPlaceholder }],
})
export class NgxPlaceholder {
  readonly _ref = new PlaceHolderRef();
  private readonly list = inject(NGX_DROPLIST, { optional: true, skipSelf: true });
  constructor(public readonly tpl: TemplateRef<unknown>) {
    this._ref.tpl = tpl;
    this._ref.dropList = this.list?._ref;
  }
}
