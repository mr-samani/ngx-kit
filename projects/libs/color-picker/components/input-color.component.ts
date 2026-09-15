import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ColorFormats } from '../contracts/ColorFormats.enum';
import { NgxColor } from '../utils/color-helper';
import { OutputType } from '../contracts/OutputType';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ColorInspector } from '../contracts/ColorInspector.enum';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from '../pipes/enum-to-array.pipe';
import { PickerComponent } from '../inspectors/picker/picker.component';
import { CmykComponent } from '../inspectors/cmyk/cmyk.component';
import { HslComponent } from '../inspectors/hsl/hsl.component';
import { RgbComponent } from '../inspectors/rgb/rgb.component';
import { NGX_INPUT_COLOR_CONFIG } from '../tokens/input-color.token';
declare const EyeDropper: any;

@Component({
  standalone: true,
  selector: 'ngx-input-color',
  templateUrl: './input-color.component.html',
  styleUrls: ['./input-color.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputColorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputColorComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    EnumToArrayPipe,
    PickerComponent,
    CmykComponent,
    HslComponent,
    RgbComponent,
  ],
})
export class NgxInputColorComponent implements ControlValueAccessor, Validator {
  protected readonly configs = inject(NGX_INPUT_COLOR_CONFIG);
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

  /** @ignore */
  format: ColorFormats = ColorFormats.HSVA;
  /** @ignore */
  isDarkColor = true;

  /** @ignore */
  rgbaColor = signal('rgba(0, 0, 0, 1)');
  /** @ignore */
  hexColor = signal('#000000');
  outputColor = signal('');

  /** @ignore */
  name = signal('black');

  /** @ignore */
  isSupportedEyeDrop = 'EyeDropper' in (window ?? {});

  /** @ignore */
  color = signal(new NgxColor());

  /** @ignore */
  isDisabled = false;
  /**@ignore */
  protected _onChange = (value: string) => {};
  /**@ignore */
  protected _onTouched = () => {};
  /**@ignore */
  private _onValidateChange = () => {};

  constructor() {
    effect(() => {
      const useAlphaChannel = this.useAlphaChannel() == true;
      if (!useAlphaChannel) {
        this.color().removeAlphaChannel();
        this.emitChange();
      }
    });
  }

  public get ColorFormats(): typeof ColorFormats {
    return ColorFormats;
  }
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
  /** @ignore */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  /** @ignore */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  /** @ignore */
  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
  /** @ignore */
  registerOnValidatorChange(fn: () => void): void {
    this._onValidateChange = fn;
  }
  /** @ignore */
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.color() && this.color().isValid === false) {
      return { invalid: true };
    }
    return null;
  }

  /** @ignore */
  writeValue(value: any): void {
    try {
      const c = value ? new NgxColor(value) : new NgxColor('#000');
      this.initColor(c);
      this._onValidateChange();
    } catch (e) {
      const c = new NgxColor('#000'); // مقدار پیش‌فرض
      this.initColor(c);
    }
  }
  /** @ignore */
  openEyeDrop() {
    if (this.isSupportedEyeDrop) {
      let t = new EyeDropper().open();
      t.then(async (result: { sRGBHex: string }) => {
        this.hexColor.set(result.sRGBHex);
        this.initColor(new NgxColor(this.hexColor()));
      });
    }
  }

  selectColor(c: string) {
    this.initColor(new NgxColor(c));
  }

  /**
   *  call from directive
  /* @ignore 
   */
  async initColor(c?: NgxColor) {
    if (!c) return;
    this.color.set(c);
    this.rgbaColor.set(this.color().toRgbString());
    this.hexColor.set(this.color().toHexString());
    this.outputColor.set(await this.color().getOutputResult(this.outputType()));
    this.isDarkColor = this.color().isDark();
    this.name.set(await this.color().name());
    this.emitChange();
  }

 

  /** @ignore */
  async emitChange() {
    this.outputColor.set(await this.color().getOutputResult(this.outputType()));
    this._onChange(this.outputColor());
    this.colorChange.emit(this.outputColor());
  }
}
