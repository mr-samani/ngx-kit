import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxError],ngx-error',
  standalone: true,
})
export class NgxError {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
}
