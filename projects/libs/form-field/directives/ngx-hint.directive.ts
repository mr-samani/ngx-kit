import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxHint],ngx-hint',
})
export class NgxHint {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
}
