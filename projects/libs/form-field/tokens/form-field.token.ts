import { InjectionToken, signal } from '@angular/core';

export const MX_FORM_FIELD =
  new InjectionToken<MgxFormFieldRef>('mx-form-field', {
    factory: () => new MgxFormFieldRef(),
  });

export class MgxFormFieldRef {
  readonly value = signal('');
}
