import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
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
import { OverlayRef, OverlayService } from 'ngx-kit/shared';
import { DateAdapterRegistry } from '../adapters/date-adapter-registry';
import { NgxDateRange } from '../models/range';
import { NgxDatePickerConfig } from '../components/config';
import { NgxDateRangePickerComponent } from '../components/date-range-picker/ngx-date-range-picker.component';
import { compareDate, deserialize } from '../helpers/date.helper';
import { normalizeDateRange } from '../helpers/date-range.helper';
import { IDateAdapter } from '../adapters/IAdapter';

@Directive({
  selector: 'input[ngxInputDateRangePicker]',
  exportAs: 'ngxInputDateRangePicker',
  host: {
    class: 'ngx-datepicker-input',
    '[attr.readOnly]': 'true',
  },
  providers: [
    DateAdapterRegistry,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputDateRangePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputDateRangePicker),
      multi: true,
    },
  ],
})
export class NgxInputDateRangePicker implements ControlValueAccessor, Validator {
  protected readonly dateAdapterRegistry = inject(DateAdapterRegistry);
  protected readonly overlayService = inject(OverlayService);
  protected readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly renderer = inject(Renderer2);

  @Input() openOnClick = true;
  @Input() displayFormat = 'yyyy/MM/dd';
  @Input() rangeSeparator = ' – ';
  private _locale = 'en';
  @Input()
  set locale(value: string) {
    this._locale = value || 'en';
    this.adapter = this.dateAdapterRegistry.resolve(this._locale);
    this.formatValue();
  }
  get locale() {
    return this._locale;
  }

  @Input('min') set setMin(value: Date | null | undefined) {
    this.min = deserialize(value);
    this._validatorOnChange();
  }

  @Input('max') set setMax(value: Date | null | undefined) {
    this.max = deserialize(value);
    this._validatorOnChange();
  }

  @Input() config = new NgxDatePickerConfig();
  @Output() change = new EventEmitter<NgxDateRange<Date>>();

  private min: Date | null = null;
  private max: Date | null = null;
  private value: NgxDateRange<Date> = { start: null, end: null };
  private pickerRef?: OverlayRef<NgxDateRangePickerComponent>;
  private isDisabled = false;
  private adapter!: IDateAdapter;

  private _onChange = (_value: NgxDateRange<Date>) => {};
  private _onTouched = () => {};
  private _validatorOnChange = () => {};

  constructor(private readonly el: ElementRef<HTMLInputElement>) {
    this.adapter = this.dateAdapterRegistry.resolve(this.locale);
  }

  ngOnChanges(): void {
    this.adapter = this.dateAdapterRegistry.resolve(this.locale);
    this.formatValue();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (!this.openOnClick || this.isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }

  @HostListener('blur')
  onBlur() {
    this._onTouched();
  }

  writeValue(value: NgxDateRange<Date> | readonly [Date | null, Date | null] | null): void {
    this.value = normalizeDateRange(value);
    this.formatValue();
  }

  registerOnChange(fn: (value: NgxDateRange<Date>) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
    this.renderer.setProperty(this.el.nativeElement, 'disabled', disabled);
  }

  toggle() {
    if (this.isDisabled) return;

    if (this.pickerRef) {
      this.destroyDatePicker();
      return;
    }

    this.adapter = this.dateAdapterRegistry.resolve(this.locale);

    this.pickerRef = this.overlayService.open({
      anchor: this.el.nativeElement,
      component: NgxDateRangePickerComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'center',
      placement: 'bottom',
      margin: 4,
      configure: (instance) => {
        instance.locale = this.locale;
        instance.min = this.min;
        instance.max = this.max;
        instance.updateConfig(this.config);
        instance.writeValue(this.value);

        instance.rangeChange.subscribe((value) => {
          this.value = normalizeDateRange(value);
          this.formatValue();
          this._onChange(this.value);
          this.change.emit(this.value);

          if (this.value.start && this.value.end) {
            this._onTouched();
            this.destroyDatePicker();
          }
        });
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    const { start, end } = this.value;

    if (start && this.min && compareDate(start, this.min) < 0) {
      return { min: this.min };
    }
    if (end && this.max && compareDate(end, this.max) > 0) {
      return { max: this.max };
    }
    if (start && end && compareDate(start, end) > 0) {
      return { range: true };
    }

    return null;
  }

  private formatValue() {
    const start = this.value.start;
    const end = this.value.end;

    const format = (value: Date | null) => {
      if (!value) return '';
      const locale = this.adapter.toLocale(value);
      return this.adapter.formatDate(locale, this.displayFormat) ?? '';
    };

    const startText = format(start);
    const endText = format(end);
    const value = startText && endText
      ? `${startText}${this.rangeSeparator}${endText}`
      : startText;

    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }

  private destroyDatePicker() {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }
}
