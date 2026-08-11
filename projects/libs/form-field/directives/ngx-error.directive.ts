import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxError],ngx-error',
})
export class NgxError {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
}
