import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';

import { MX_FORM_FIELD } from '../tokens/form-field.token';

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

@Directive({
  selector: '[ngxInput],ngx-input',
  standalone: true,
  host: {
    '[class.has-value]': 'hasValue()',
  },
})
export class NgxInput implements AfterViewInit {
  private readonly el =
    inject<ElementRef<FormControlElement>>(ElementRef);

  private readonly ref = inject(MX_FORM_FIELD);

  readonly hasValue = signal(false);

  ngAfterViewInit(): void {
    // Covers initial values coming from [value], Reactive Forms,
    // template-driven forms, browser autofill, etc.
    queueMicrotask(() => this.syncValue());
  }

  @HostListener('input')
  protected onInput(): void {
    this.syncValue();
  }

  @HostListener('change')
  protected onChange(): void {
    this.syncValue();
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.syncValue();
  }

  private syncValue(): void {
    const value = this.el.nativeElement.value;

    this.ref.value.set(value);

    this.hasValue.set(
      value !== null &&
      value !== undefined &&
      value !== '',
    );
  }
}
