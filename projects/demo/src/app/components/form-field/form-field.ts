import { Component, signal } from '@angular/core';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';
import { NgxFormField } from 'ngx-kit/form-field';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  imports: [NgxFormField, MatAnchor],
})
export class FormFieldComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/form-field/form-field.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/form-field/form-field.html', language: 'html' },
  ];

  // ─────────────────────────────────────────────────────────
  // Form values (Signals)
  // ─────────────────────────────────────────────────────────
  readonly requiredField = signal('');
  readonly withValue = signal('this is a value');
  readonly username = signal('');
  readonly password = signal('');
  readonly withPlaceholder = signal('');
  readonly numValue = signal(1);
  readonly searchValue = signal('');

  // ─────────────────────────────────────────────────────────
  // Additional states
  // ─────────────────────────────────────────────────────────
  readonly disabledField = signal('disabled value');
  readonly readonlyField = signal('readonly value');
  readonly invalidEmail = signal('not-an-email');
  readonly longText = signal('A long text example to demonstrate the textarea');
  readonly fullName = signal('');
  readonly tel = signal(+989595689);

  // ─────────────────────────────────────────────────────────
  // Form state
  // ─────────────────────────────────────────────────────────
  readonly formSubmitted = signal(false);
  readonly loginError = signal<string[]>([]);

  // ─────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────
  onLoginSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);

    const errors: string[] = [];
    if (!this.username()) errors.push('Username is required');
    if (!this.password()) errors.push('Password is required');
    if (this.password().length > 0 && this.password().length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    this.loginError.set(errors);

    if (errors.length === 0) {
      alert(`Login successful!\nUsername: ${this.username()}`);
    }
  }

  resetForm(): void {
    this.username.set('');
    this.password.set('');
    this.formSubmitted.set(false);
    this.loginError.set([]);
  }
}
