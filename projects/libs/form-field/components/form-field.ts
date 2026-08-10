// form-field.component.ts
import { Component, ChangeDetectionStrategy, input, output, model, computed } from '@angular/core';
import { NgxFormFieldType } from '../types/field-type';

let nextId = 0;

@Component({
  selector: 'ngx-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.dir]': 'dir() || null',
  },
})
export class NgxFormField {
  // ─────────────────────────────────────────────────────────
  // Two-way binding
  // ─────────────────────────────────────────────────────────
  readonly value = model<string | number>('');

  // ─────────────────────────────────────────────────────────
  // Required inputs
  // ─────────────────────────────────────────────────────────
  readonly label = input.required<string>();

  // ─────────────────────────────────────────────────────────
  // Optional inputs (Signal inputs)
  // ─────────────────────────────────────────────────────────
  readonly type = input<NgxFormFieldType>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly float = input<boolean>(false);
  readonly name = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly rows = input<number>(3);
  readonly hint = input<string>('');
  readonly errorMessages = input<string[]>([]);
  readonly dir = input<'' | 'ltr' | 'rtl'>('');
  readonly id = input<string>(`mx-field-${++nextId}`);

  // ─────────────────────────────────────────────────────────
  // Outputs
  // ─────────────────────────────────────────────────────────
  readonly focused = output<void>();
  readonly blurred = output<void>();

  // ─────────────────────────────────────────────────────────
  // Derived state (Computed signal)
  // ─────────────────────────────────────────────────────────
  readonly hasValue = computed(() => {
    const v = this.value();
    return v !== null && v !== undefined && v !== '';
  });

  // ─────────────────────────────────────────────────────────
  // Event handlers
  // ─────────────────────────────────────────────────────────
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value.set(target.value);
  }

  onFocus(): void {
    this.focused.emit();
  }

  onBlur(): void {
    this.blurred.emit();
  }
}
