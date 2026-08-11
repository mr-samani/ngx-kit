// form-field.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
  inject,
  effect,
  signal,
} from '@angular/core';
import { MX_FORM_FIELD } from '../tokens/form-field.token';

@Component({
  selector: 'ngx-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
})
export class NgxFormField {
  protected readonly ref = inject(MX_FORM_FIELD);

  // ─────────────────────────────────────────────────────────
  // Required inputs
  // ─────────────────────────────────────────────────────────
  readonly label = input.required<string>();

  // ─────────────────────────────────────────────────────────
  // Optional inputs (Signal inputs)
  // ─────────────────────────────────────────────────────────
  readonly float = input<boolean>(false);
}
