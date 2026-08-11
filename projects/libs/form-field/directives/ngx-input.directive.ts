import { Directive, ElementRef, HostListener, inject, signal } from '@angular/core';
import { MX_FORM_FIELD } from '../tokens/form-field.token';

@Directive({
  selector: '[ngxInput],ngx-input',
  host: {
    '[class.has-value]': `hasValue()`,
  },
})
export class NgxInput {
  readonly el = inject<ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(
    ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  );

  protected readonly ref = inject(MX_FORM_FIELD);
  readonly hasValue = signal(false);

  @HostListener('input', ['$event'])
  protected onInput(ev: Event) {
    const v = (ev.currentTarget as any).value;
    this.ref.value.set(v);
    this.hasValue.set(v !== null && v !== undefined && v !== '');
  }
}
