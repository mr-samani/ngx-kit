import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
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

import { ColorInspector } from '../contracts/ColorInspector.enum';
import { NgxInputColorComponent } from '../components/input-color.component';
import { NgxColor } from '../utils/color-helper';
import { OutputType } from '../contracts/OutputType';
import { OverlayRef, OverlayService } from 'ngx-kit/shared';

@Directive({
  selector: '[ngxInputColor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputColor),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputColor),
      multi: true,
    },
  ],
})
export class NgxInputColor implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() setInputBackgroundColor = true;
  @Input() defaultInspector: ColorInspector = ColorInspector.Picker;
  @Input() simpleMode = false;
  @Input() outputType: OutputType = 'HEX';
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  private useAlphaChannel = true;
  @Input('useAlphaChannel')
  set setUseAlphaChannel(value: boolean) {
    this.useAlphaChannel = value === true;
    if (!this.useAlphaChannel && this.color) {
      this.color.removeAlphaChannel();
      void this.color.getOutputResult(this.outputType).then((value) => this.emitChange(value));
    }
  }

  /**
   * Input target.
   *
   * Supported:
   *
   * <input ngxInputColor>
   *
   * or
   *
   * <div [ngxInputColor]="inputElement"></div>
   *
   * or
   *
   * <div [ngxInputColor]="inputRef"></div>
   */
  @Input('ngxInputColor')
  set ngxInputColor(
    element: HTMLInputElement | ElementRef<HTMLInputElement> | null | undefined | '',
  ) {
    this.removeTargetInputListener();

    this.isHostInput = false;
    this.explicitTargetInput = false;

    if (element instanceof ElementRef) {
      this._targetInput = element.nativeElement;
      this.explicitTargetInput = true;
    } else if (this.isInputElement(element)) {
      this._targetInput = element;
      this.explicitTargetInput = true;
    } else {
      /**
       * Bare directive:
       *
       * <input ngxInputColor>
       *
       * In this case the host itself is the target.
       */
      const host = this.el.nativeElement;

      if (host instanceof HTMLInputElement) {
        this._targetInput = host;
        this.isHostInput = true;
      } else {
        this._targetInput = undefined;
      }
    }

    this.bindTargetInput();
  }

  @Output() change = new EventEmitter<string>();

  private color?: NgxColor;
  private pickerRef?: OverlayRef<NgxInputColorComponent>;
  private _targetInput?: HTMLInputElement;
  private explicitTargetInput = false;
  private isHostInput = false;
  private removeInputListener?: () => void;
  private disabled = false;
  private invalid = false;
  protected _onChange: (value: string) => void = () => {};
  protected _onTouched: () => void = () => {};
  private _onValidateChange: () => void = () => {};

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly overlayService: OverlayService,
  ) {}

  ngAfterViewInit(): void {
    /**
     * The input binding may not have been processed in every
     * possible usage scenario. Make sure a host input is detected.
     */
    if (!this._targetInput && this.isInputElement(this.el.nativeElement)) {
      this._targetInput = this.el.nativeElement;
      this.isHostInput = true;

      this.bindTargetInput();
    }

    if (this._targetInput) {
      this.writeValue(this._targetInput.value);
    }
  }

  ngOnDestroy(): void {
    this.removeTargetInputListener();
    this.destroyColorPicker();
  }

  /**
   * Open the custom color picker.
   */
  @HostListener('click', ['$event'])
  onHostClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.toggleColorPicker();
  }

  /**
   * Called by Angular Forms.
   *
   * IMPORTANT:
   * writeValue must NEVER call _onChange().
   */
  writeValue(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.color = undefined;
      this.invalid = false;

      this.syncView('');
      this.notifyValidatorChange();

      return;
    }

    try {
      const color = value instanceof NgxColor ? value : new NgxColor(String(value));

      if (color.isValid === false) {
        throw new Error('Invalid color');
      }

      this.color = color;
      this.invalid = false;

      const colorValue = this.getViewColor();

      this.syncView(colorValue);
    } catch {
      this.color = undefined;
      this.invalid = true;

      /**
       * Do not replace an invalid value with black.
       *
       * Angular/form validation needs to know that the value
       * is invalid instead of silently turning it into #000.
       */
      this.syncView('');

      this.notifyValidatorChange();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;

    /**
     * Host element.
     */
    if (this.isInputElement(this.el.nativeElement)) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', disabled);
    }

    /**
     * External target input.
     */
    if (this._targetInput && this._targetInput !== this.el.nativeElement) {
      this.renderer.setProperty(this._targetInput, 'disabled', disabled);
    }

    if (disabled) {
      this.destroyColorPicker();
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onValidateChange = fn;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.invalid) {
      return {
        invalid: true,
      };
    }
    if (this.color?.isValid === false) {
      return {
        invalid: true,
      };
    }
    return null;
  }

  private bindTargetInput(): void {
    if (!this._targetInput) {
      return;
    }
    this.removeInputListener?.();
    this.removeInputListener = this.renderer.listen(this._targetInput, 'input', (event: Event) => {
      this.handleInputEvent(event);
    });
  }

  private removeTargetInputListener(): void {
    this.removeInputListener?.();
    this.removeInputListener = undefined;
  }

  /**
   * Handles native input changes.
   *
   * This is deliberately NOT implemented using writeValue(),
   * because this is a user-originated value and therefore
   * must propagate through ControlValueAccessor.
   */
  private handleInputEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    try {
      const color = value ? new NgxColor(value) : undefined;
      if (color && color.isValid === false) {
        this.color = undefined;
        this.invalid = true;
        this.notifyValidatorChange();
        return;
      }

      this.color = color;
      this.invalid = false;
      this.syncHostBackground(value);
      /**
       * User change → Angular Forms.
       */
      this._onChange(value);
      this.change.emit(value);
      this._onTouched();
      this.notifyValidatorChange();
    } catch {
      this.color = undefined;
      this.invalid = true;
      this.notifyValidatorChange();
    }
  }

  private toggleColorPicker(): void {
    if (this.disabled) {
      return;
    }
    if (this.pickerRef) {
      this.destroyColorPicker();
      return;
    }

    this.pickerRef = this.overlayService.open({
      anchor: this.el.nativeElement,
      component: NgxInputColorComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'start',
      placement: 'auto',
      configure: (instance, ref) => {
        instance.defaultInspector = this.defaultInspector;
        instance.simpleMode = this.simpleMode;
        instance.outputType = this.outputType;
        instance.setTheme = this.theme;
        instance.setUseAlphaChannel = this.useAlphaChannel;
        if (this.color?.isValid) {
          instance.writeValue(this.color);
        }

        instance.change.subscribe((value: string) => {
          this.color = new NgxColor(value);
          void this.emitChange(value);
        });

        // instance.closed.subscribe(() => ref.close());
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  private destroyColorPicker(): void {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }

  /**
   * User-originated/custom-picker value.
   *
   * This is the ONLY place where _onChange is called.
   */
  private async emitChange(value: string): Promise<void> {
    try {
      const color = new NgxColor(value);
      if (color.isValid === false) {
        this.invalid = true;
        this.notifyValidatorChange();

        return;
      }
      this.color = color;
      this.invalid = false;
      const viewValue = this.getViewColor();
      this.syncView(viewValue);
      /**
       * Do NOT dispatch another input event here.
       */
      this._onChange(viewValue);
      this.change.emit(viewValue);
      this._onTouched();
      this.notifyValidatorChange();
    } catch {
      this.invalid = true;
      this.notifyValidatorChange();
    }
  }

  /**
   * Synchronize all visual representations.
   */
  private syncView(value: string): void {
    /**
     * Host input value.
     */
    if (this.isHostInput) {
      const input = this.el.nativeElement as HTMLInputElement;
      input.value = this.getNativeInputColor(value);
    }

    /**
     * External target input.
     */
    if (this._targetInput && this._targetInput !== this.el.nativeElement) {
      this._targetInput.value = this.getNativeInputColor(value);
    }
    /**
     * Background of host element.
     */
    this.syncHostBackground(value);
  }

  /**
   * input[type=color] only accepts a 6-digit RGB hex value.
   *
   * Therefore even if the selected color contains alpha,
   * the native color input receives #RRGGBB.
   */
  private getNativeInputColor(value: string): string {
    if (!value) {
      return '';
    }
    try {
      const color = new NgxColor(value);

      return color.toHexString();
    } catch {
      return '';
    }
  }

  private getViewColor(): string {
    return this.color?.toHexString() ?? '';
  }

  private syncHostBackground(value: string): void {
    if (!this.setInputBackgroundColor) {
      return;
    }
    const element = this.el.nativeElement;
    this.renderer.setStyle(element, 'backgroundColor', value || null);
  }

  private notifyValidatorChange(): void {
    this._onValidateChange();
  }

  private isInputElement(value: unknown): value is HTMLInputElement {
    return value instanceof HTMLInputElement;
  }
}
