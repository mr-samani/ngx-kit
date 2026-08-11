import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxSuffix],ngx-suffix',
})
export class NgxSuffix {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
}
