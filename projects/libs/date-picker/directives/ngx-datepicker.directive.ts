import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  input,
  Input,
  OnInit,
  Output,
  Renderer2,
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
import { NgxInputDatePickerComponent } from '../components/datepicker/ngx-datepicker.component';
import { clampDate, deserialize, isValid, sameDate } from '../helpers/date.helper';
import { DialogOverlayRef, DialogService } from 'ngx-kit/shared';
import { IDateAdapter } from '../adapters/IAdapter';
import { Locale } from '../adapters/locale';
import { NgxDatePickerConfig } from '../components/config';
import { CalendarAdapterFactory } from '../adapters/factory';

@Directive({
  selector: '[ngxInputDatePicker]',
  exportAs: 'ngxInputDatePicker',
  host: {
    class: 'ngx-datepicker-input',
    '[attr.readOnly]': 'true',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputDatePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputDatePicker),
      multi: true,
    },
  ],
})
export class NgxInputDatePicker implements ControlValueAccessor, Validator {
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  openOnCLick = input<boolean>(true);

  @Output() change = new EventEmitter<Date>();
  private value?: Date | null;
  private pickerRef?: DialogOverlayRef<NgxInputDatePickerComponent>;
  adapter!: IDateAdapter;
  private _locale: Locale = 'en';
  @Input() set locale(val: Locale) {
    this._locale = val;
    this.adapter = CalendarAdapterFactory.create(this._locale);
  }

  _onChange = (value: Date | null | undefined) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};

  /**
   * display format in input
   */
  @Input() displayFormat: string = 'yyyy/MM/dd';

  private min: Date | null = null;
  /** The minimum valid date. */
  @Input('min') set setMin(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.min)) {
      this.min = validValue;
      this._validatorOnChange();
    }
  }

  private max: Date | null = null;
  /** The maximum valid date. */
  @Input('max') set setMax(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this.max)) {
      this.max = validValue;
      this._validatorOnChange();
    }
  }
  private config = new NgxDatePickerConfig();
  @Input('config') set seConfig(val: NgxDatePickerConfig) {
    this.config = { ...new NgxDatePickerConfig(), ...val };
  }

  private isDisabled = false;

  private readonly dialogService = inject(DialogService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnDestroy(): void {
    this.destroyAnglePicker();
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
    const validValue = deserialize(input.value);
    this.value = validValue;
    this._formatValue(this.value);
    this._onChange(this.value);
  }

  @HostListener('blur')
  onBlur() {
    this._onTouched();
  }

  writeValue(value: any): void {
    const validValue = deserialize(value);
    this.value = validValue;
    this._formatValue(this.value);
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
      this.destroyAnglePicker();
      return;
    }

    this.pickerRef = this.dialogService.open({
      anchor: this.el.nativeElement,
      component: NgxInputDatePickerComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'center',
      placement: 'bottom',
      margin: 2,
      configure: (instance, ref) => {
        instance.locale = this._locale;
        instance.minDate = this.min;
        instance.maxDate = this.max;
        instance.setTheme = this.theme;
        instance.config = this.config;

        instance.writeValue(this.value);

        instance.change.subscribe((c: Date) => {
          this.value = c;
          this.emitChange(c);
        });

        // instance.closed.subscribe(() => ref.close());
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  private destroyAnglePicker() {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }
  private async emitChange(c: Date) {
    this._formatValue(c);
    this._onChange(c);
    this.change.emit(c);
    this._onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.value) {
      if (!isValid(this.value)) {
        return {
          invalid: true,
        };
      }
      let c = clampDate(this.value, this.min, this.max);
      if (c < 0) {
        return {
          invalid: true,
          min: this.min,
        };
      } else if (c > 0) {
        return {
          invalid: true,
          max: this.max,
        };
      }
    }
    return null;
  }

  /** Formats a value and sets it on the input element. */
  protected _formatValue(value: Date | null, setChange = false) {
    let val = '';
    if (value && this.adapter) {
      let o = this.adapter.getOutputDate(value);
      val = (value && this.adapter.formatDate(o, this.displayFormat)) ?? '';
    }
    this.renderer.setProperty(this.el.nativeElement, 'value', val);

    if (setChange) {
      this._onChange(this.value);
    }
  }
}
