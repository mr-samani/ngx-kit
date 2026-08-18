import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  inject,
} from '@angular/core';

import { MX_FORM_FIELD } from '../tokens/form-field.token';

@Component({
  selector: 'ngx-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxFormField {
  protected readonly ref = inject(MX_FORM_FIELD);

  readonly label = input.required<string>();

  /**
   * Forces the label to float even when the control is empty.
   * Similar to Material's floatLabel behavior.
   */
  readonly float = input(false);

  /**
   * Explicit state overrides are useful when the projected control
   * is managed by Angular Forms.
   */
  readonly invalid = input(false);
  readonly required = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);

  readonly hintVisible = computed(() => !this.invalid());

  readonly errorVisible = computed(() => this.invalid());
}
