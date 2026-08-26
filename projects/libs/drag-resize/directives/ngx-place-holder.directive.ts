import { Directive, inject, InjectionToken, TemplateRef } from '@angular/core';
import { PlaceHolderRef } from '../placeholder-ref';
import { NGX_DROPLIST } from './ngx-drop-list.directive';

export const NGX_PLACEHOLDER = new InjectionToken<PlaceHolderRef>('ngx-place-holder');

@Directive({
  selector: '[NgxPlaceholder]',
  providers: [{ provide: NGX_PLACEHOLDER, useExisting: NgxPlaceholder }],
})
export class NgxPlaceholder {
  private dropListContainer = inject(NGX_DROPLIST, { skipSelf: true, optional: true });

  _ref = new PlaceHolderRef();

  constructor(public tpl: TemplateRef<HTMLElement>) {
    this._ref.tpl = tpl;
    this._ref.dropList = this.dropListContainer?._ref;
  }
}
