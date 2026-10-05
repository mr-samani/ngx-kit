import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  input,
  Input,
  model,
  OnDestroy,
  output,
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
import { OverlayRef, OverlayService } from 'ngx-kit/core';
import { NGX_INPUT_COLOR_CONFIG } from '../tokens/input-color.token';

@Directive({
  selector: '[ngxInputColor]',
  exportAs: 'ngxInputColor',
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
  protected readonly configs = inject(NGX_INPUT_COLOR_CONFIG);
  readonly setInputBackgroundColor = input(true);
  /** Minifi UI  */
  readonly simpleMode = input(this.configs.simpleMode ?? false);
  readonly outputType = input<OutputType>(this.configs.outputType ?? 'HEX');
  readonly defaultInspector = model<ColorInspector>(
    this.configs.defaultInspector ?? ColorInspector.Picker,
  );
  readonly useAlphaChannel = input<boolean>(this.configs.useAlphaChannel ?? true);

  readonly showPresets = input(this.configs.showPresets ?? true);
  readonly presetColors = input(this.configs.presetColors ?? []);

  /** Emitted when the color value changes */
  colorChange = output<string>();

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

    if (element instanceof ElementRef) {
      this._targetInput = element.nativeElement;
    } else if (this.isInputElement(element)) {
      this._targetInput = element;
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
  private isHostInput = false;
  private syncingTargetInput = false;
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
  ) {
    effect(() => {
      const useAlphaChannel = this.useAlphaChannel() == true;
      if (!useAlphaChannel && this.color) {
        this.color.removeAlphaChannel();
        void this.color.getOutputResult(this.outputType()).then((value) => this.emitChange(value));
      }
    });
  }

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
      this.readTargetInput();
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

    this.toggle();
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

      this.syncView(value instanceof NgxColor ? this.getViewColor() : String(value));
    } catch {
      this.color = undefined;
      this.invalid = true;

      /**
       * Do not replace an invalid value with black.
       *
       * Angular/form validation needs to know that the value
       * is invalid instead of silently turning it into #000.
       */
      this.syncView(String(value));
      this.syncHostBackground('');

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
    if (this.syncingTargetInput) return;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    let color: NgxColor | undefined;
    try {
      color = value ? new NgxColor(value) : undefined;
    } catch {
      color = undefined;
    }

    this.color = color?.isValid ? color : undefined;
    this.invalid = !!value && !this.color;
    this.syncHostBackground(this.invalid ? '' : value);
    this._onChange(value);
    this.change.emit(value);
    this._onTouched();
    this.notifyValidatorChange();
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    if (this.pickerRef) {
      this.destroyColorPicker();
      return;
    }

    // A bound model can change this input's value without firing a DOM event.
    this.readTargetInput();

    this.pickerRef = this.overlayService.open({
      anchor: this.el.nativeElement,
      component: NgxInputColorComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'start',
      placement: 'auto',
      configure: (instance, ref) => {
        ref.componentRef?.setInput('defaultInspector', this.defaultInspector());
        ref.componentRef?.setInput('simpleMode', this.simpleMode());
        ref.componentRef?.setInput('outputType', this.outputType());
        ref.componentRef?.setInput('useAlphaChannel', this.useAlphaChannel());
        ref.componentRef?.setInput('showPresets', this.showPresets());
        ref.componentRef?.setInput('presetColors', this.presetColors());

        if (this.color?.isValid) {
          instance.writeValue(this.color);
        }

        instance.colorChange.subscribe((value: string) => {
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

  /** Propagates values selected from the custom picker. */
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
      this.syncView(value, true);
      this._onChange(value);
      this.change.emit(value);
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
  private syncView(value: string, notifyTargetInput = false): void {
    /**
     * Host input value.
     */
    if (this.isHostInput) {
      const input = this.el.nativeElement as HTMLInputElement;
      input.value = this.getNativeInputColor(value, input);
    }

    /**
     * External target input.
     */
    if (this._targetInput && this._targetInput !== this.el.nativeElement) {
      this._targetInput.value = this.getNativeInputColor(value, this._targetInput);
      if (notifyTargetInput) {
        this.syncingTargetInput = true;
        try {
          this._targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        } finally {
          this.syncingTargetInput = false;
        }
      }
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
  private getNativeInputColor(value: string, input: HTMLInputElement): string {
    if (!value) {
      return '';
    }
    if (input.type !== 'color') return value;
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
    if (!this.setInputBackgroundColor()) {
      return;
    }
    const element = this._targetInput ?? this.el.nativeElement;
    this.renderer.setStyle(element, 'backgroundColor', value || null);
  }

  private readTargetInput(): void {
    if (!this._targetInput) return;

    const value = this._targetInput.value;
    if (!value) {
      this.color = undefined;
      this.invalid = false;
      this.syncHostBackground('');
      this.notifyValidatorChange();
      return;
    }

    try {
      const color = new NgxColor(value);
      this.color = color.isValid ? color : undefined;
      this.invalid = !color.isValid;
      this.syncHostBackground(this.invalid ? '' : value);
    } catch {
      this.color = undefined;
      this.invalid = true;
      this.syncHostBackground('');
    }
    this.notifyValidatorChange();
  }

  private notifyValidatorChange(): void {
    this._onValidateChange();
  }

  private isInputElement(value: unknown): value is HTMLInputElement {
    return value instanceof HTMLInputElement;
  }
}
