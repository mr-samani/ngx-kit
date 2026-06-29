import { Directive, ElementRef, forwardRef, HostListener, Input, OnInit } from '@angular/core';
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
export class NgxInputDatePicker implements ControlValueAccessor, Validator, OnInit {
  _onChange = (value: any) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};

  _datepicker!: NgxInputDatePickerComponent;

  /** The datepicker that this input is associated with. */
  @Input('ngxInputDatePicker') set setDatePicker(datepicker: NgxInputDatePickerComponent) {
    this._datepicker = datepicker;
  }
  /**
   * display format in input
   */
  @Input() displayFormat: string = 'yyyy/MM/dd';

  private _min: Date | null = null;
  /** The minimum valid date. */
  @Input() set min(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this._min)) {
      this._min = validValue;
      this._datepicker.minDate = validValue;
      this._validatorOnChange();
    }
  }

  private _max: Date | null = null;
  /** The maximum valid date. */
  @Input() set max(value: Date | null | undefined) {
    const validValue = deserialize(value);
    if (!sameDate(validValue, this._max)) {
      this._max = validValue;
      this._datepicker.maxDate = validValue;
      this._validatorOnChange();
    }
  }

  constructor(private _elementRef: ElementRef<HTMLInputElement>) {}

  validate(control: AbstractControl): ValidationErrors | null {
    if (this._datepicker._date) {
      if (!isValid(this._datepicker._date)) {
        return {
          invalid: true,
        };
      }
      let c = clampDate(this._datepicker._date, this._min, this._max);
      if (c < 0) {
        return {
          invalid: true,
          min: this._min,
        };
      } else if (c > 0) {
        return {
          invalid: true,
          max: this._max,
        };
      }
    }
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this._validatorOnChange = fn;
  }
  ngOnInit(): void {
    if (!this._datepicker) {
      throw new Error('<ngx-datepicker> not binded to input element!');
    }
    this._datepicker?.dateChange.subscribe((val) => {
      if (val) this._datepicker._date = new Date(val);
      else this._datepicker._date = null;
      let d = deserialize(val);
      this._formatValue(d, true);
    });
    this.setDatePickerPanelPosition();
  }
  /** Formats a value and sets it on the input element. */
  protected _formatValue(value: Date | null, setChange = false) {
    let val = '';
    if (value) {
      let o = this._datepicker?.adapter.getOutputDate(value);
      val = (value && this._datepicker?.adapter.formatDate(o, this.displayFormat)) ?? '';
    }
    this._elementRef.nativeElement.value = val;
    if (setChange) {
      this._onChange(this._datepicker?.value);
    }
  }

  writeValue(value: any): void {
    this.checkWritedValue(value);
  }

  /**
   * update value for change display format in input
   * @param val
   */
  updateValue(val: Date) {
    setTimeout(() => {
      this.writeValue(val);
    }, 10);
  }

  private checkWritedValue(value: any) {
    //  this._date = value;
    const validValue = deserialize(value);
    if (validValue) {
      //  setTimeout(() => {
      this._datepicker._date = validValue;
      this._formatValue(this._datepicker._date);
      this._onChange(this._datepicker._date);
      //  }, 100);
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(disabled: boolean): void {
    if (this._datepicker) {
      this._datepicker.isDisabled = disabled;
    }
  }

  setDatePickerPanelPosition() {
    let boundingElement = this._elementRef.nativeElement.getBoundingClientRect();
    const inputW = boundingElement.width;
    const inputH = boundingElement.height;
    const inputL = boundingElement.left;
    const inputT = boundingElement.top;
    const datepickerW = this._datepicker.wrapperWidth;

    this._datepicker.panelLeft = inputL + inputW / 2 - datepickerW / 2;
    this._datepicker.panelTop = inputT + inputH;
  }

  // @HostListener('focus', ['$event'])
  // @HostListener('active', ['$event'])
  // onInputFocus(event: Event): void {
  //   this._datepicker.showPanel = true;
  //   this._datepicker.setDate(this._date);
  // }
  // @HostListener('blur', ['$event'])
  // onInputBlur(event: Event): void {
  //   this._datepicker.showPanel = false;
  // }

  // @HostListener('window:click', ['$event'])
  // onOutsideClick(event: any) {
  //   if (!this._elementRef.nativeElement.contains(event.target) &&
  //     !this._datepicker._elementRef.nativeElement.contains(event.target)) {
  //     this._datepicker.showPanel = false;
  //   }
  // }

  // @HostListener('input', ['$event']) onInputChange(event: Event): void {
  //   let val = this._elementRef.nativeElement.value;
  //   this.checkWritedValue(val);
  // }
  // @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent): void {
  //   let val = this._elementRef.nativeElement.value;
  //   this.checkWritedValue(val);
  // }

  @HostListener('click', ['$event']) onInputChange(event: Event): void {
    this.setDatePickerPanelPosition();
    this._datepicker.togglePanel();
  }
  @HostListener('window:scroll', ['$event']) onScroll(event: Event): void {
    this.setDatePickerPanelPosition();
  }
  @HostListener('window:resize', ['$event']) onResize(event: Event): void {
    this.setDatePickerPanelPosition();
  }
}
