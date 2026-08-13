import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  output,
  Output,
  Renderer2,
  signal,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { OverlayRef, OverlayService } from 'ngx-kit/shared';
import { NgxInputTimePickerComponent } from '../components/time-picker/time-picker';
import { NGX_TIME_PICKER_CONFIG } from '../types/config';
import { normalizeTime } from '../utils/normalize';

@Directive({
  selector: '[ngxInputTimePicker]',
  exportAs: 'ngxInputTimePicker',
  host: {
    class: 'ngx-datepicker-input',
    '[attr.readOnly]': 'true',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputTimePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputTimePicker),
      multi: true,
    },
  ],
})
export class NgxInputTimePicker implements ControlValueAccessor, Validator {
  protected readonly config = inject(NGX_TIME_PICKER_CONFIG);

  openOnCLick = input<boolean>(true);

  readonly change = output<string | null>();
  protected readonly value = signal<string>('');

  readonly format = input<'12' | '24'>(this.config.format);

  private pickerRef?: OverlayRef<NgxInputTimePickerComponent>;

  protected _onChange = (value: string | null | undefined) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};

  private isDisabled = false;

  private readonly overlayService = inject(OverlayService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.openOnCLick() && !this.isDisabled) {
      ev.stopPropagation();
      ev.preventDefault();
      this.toggle();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value ?? '');
    this._formatValue();
    this._onChange(this.value());
  }

  @HostListener('blur')
  onBlur() {
    this._onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value);
    this._formatValue();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this._validatorOnChange = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
    if (disabled) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', disabled);
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
  }

  public toggle() {
    if (this.pickerRef || this.isDisabled) {
      this.destroy();
      return;
    }

    this.pickerRef = this.overlayService.open({
      anchor: this.el.nativeElement,
      component: NgxInputTimePickerComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'center',
      placement: 'bottom',
      margin: 2,
      configure: (instance, ref) => {
        instance.writeValue(this.value());

        instance.change.subscribe((c: string | null) => {
          this.value.set(c ?? '');
          this.emitChange();
          this.destroy();
        });

        instance.cancel.subscribe(() => ref.close());
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  private destroy() {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }
  private async emitChange() {
    this._onChange(this.value());
    this._formatValue();
    this.change.emit(this.value());
    this._onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const raw = this.value();
    if (!raw) return null; // empty is handled by Validators.required, not us
    return normalizeTime(raw) === null ? { invalid: true } : null;
  }

  protected _formatValue() {
    this.renderer.setProperty(this.el.nativeElement, 'value', this.value());
  }
}
