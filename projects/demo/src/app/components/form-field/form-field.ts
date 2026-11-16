import { Component, signal, type WritableSignal } from '@angular/core';
import { NgxError, NgxFormField, NgxHint, NgxInput } from 'ngx-kit/form-field';
import { ExampleShowcaseComponent } from '../../shared/showcase/example-showcase.component';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  imports: [NgxFormField, NgxInput, NgxHint, NgxError, ExampleShowcaseComponent],
})
export class FormFieldComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/form-field/form-field.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/form-field/form-field.html', language: 'html' },
    { label: 'SCSS', path: 'examples/form-field/form-field.scss', language: 'scss' },
  ];

  readonly requiredField = signal('');
  readonly withValue = signal('A value is already here');
  readonly withPlaceholder = signal('');
  readonly disabledField = signal('Unavailable right now');
  readonly readonlyField = signal('This value is read-only');
  readonly invalidEmail = signal('not-an-email');
  readonly longText = signal('Describe what you would like to build…');
  readonly age = signal(28);
  readonly searchValue = signal('');

  readonly username = signal('');
  readonly password = signal('');
  readonly loginSubmitted = signal(false);
  readonly loginErrors = signal<string[]>([]);
  readonly loginStatus = signal('');

  readonly fullName = signal('');
  readonly contactEmail = signal('');
  readonly phone = signal('');
  readonly contactMessage = signal('');
  readonly contactSubmitted = signal(false);
  readonly contactErrors = signal<string[]>([]);
  readonly contactStatus = signal('');

  setTextValue(value: WritableSignal<string>, event: Event): void {
    value.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  setNumberValue(value: WritableSignal<number>, event: Event): void {
    const numberValue = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(numberValue)) value.set(numberValue);
  }

  onLoginSubmit(event: Event): void {
    event.preventDefault();
    this.loginSubmitted.set(true);

    const errors: string[] = [];
    if (!this.username().trim()) errors.push('Enter a username.');
    if (!this.password()) errors.push('Enter a password.');
    else if (this.password().length < 6) errors.push('Use at least 6 characters for the password.');

    this.loginErrors.set(errors);
    this.loginStatus.set(
      errors.length ? 'Please review the highlighted fields.' : 'Signed in locally.',
    );
  }

  resetLogin(): void {
    this.username.set('');
    this.password.set('');
    this.loginSubmitted.set(false);
    this.loginErrors.set([]);
    this.loginStatus.set('');
  }

  onContactSubmit(event: Event): void {
    event.preventDefault();
    this.contactSubmitted.set(true);

    const errors: string[] = [];
    if (!this.fullName().trim()) errors.push('Enter your name.');
    if (!this.isValidEmail(this.contactEmail())) {
      errors.push('Enter a valid email address.');
    }

    this.contactErrors.set(errors);
    this.contactStatus.set(
      errors.length ? 'Please correct the details and try again.' : 'Your demo message is ready.',
    );
  }

  isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  resetContact(): void {
    this.fullName.set('');
    this.contactEmail.set('');
    this.phone.set('');
    this.contactMessage.set('');
    this.contactSubmitted.set(false);
    this.contactErrors.set([]);
    this.contactStatus.set('');
  }
}
