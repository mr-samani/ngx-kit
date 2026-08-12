import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxPrefix],ngx-prefix',
  standalone: true,
})
export class NgxPrefix {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
}
