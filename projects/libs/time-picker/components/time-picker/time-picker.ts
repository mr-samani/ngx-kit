import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  model,
  OnInit,
  output,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserService } from 'ngx-kit/shared';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import type { NgxTimePickerMode } from '../../types/mode';
import { NGX_TIME_PICKER_CONFIG } from 'ngx-kit/time-picker/types/config';

@Component({
  selector: 'ngx-time-picker',
  templateUrl: './time-picker.html',
  styleUrls: ['./time-picker.scss'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputTimePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputTimePickerComponent),
      multi: true,
    },
  ],
})
export class NgxInputTimePickerComponent implements ControlValueAccessor, Validator, OnInit {
  protected readonly browserService = inject(BrowserService);

  readonly change = output<string | null>();
  readonly cancel = output<void>();

  protected readonly config = inject(NGX_TIME_PICKER_CONFIG);
  isDisabled = false;

  /**
   * Time value.
   *
   * Example:
   * 14:35
   */
  readonly value = model<string>('12:00');

  /**
   * 12h or 24h.
   */
  readonly format = input<'12' | '24'>(this.config.format);
  readonly amOrPm = model<'AM' | 'PM' | undefined>(this.config.format == '12' ? 'AM' : undefined);

  /**
   * Minute step.
   */
  readonly minuteStep = input(this.config.minuteStep);

  /**
   * Whether the clock is disabled.
   */
  readonly disabled = input(false);

  /**
   * Whether to automatically switch from hour to minute.
   */
  readonly autoSwitchToMinute = input<boolean>(this.config.autoSwitchToMinute);

  readonly clock = viewChild<ElementRef<SVGSVGElement>>('clock');

  readonly mode = signal<NgxTimePickerMode>('hour');

  private dragging = false;

  readonly parsedTime = computed(() => {
    const value = this.value();

    const [hour, minute] = value.split(':').map(Number);

    return {
      hour: Number.isFinite(hour) ? hour : 12,
      minute: Number.isFinite(minute) ? minute : 0,
    };
  });

  readonly displayHour = computed(() => {
    const { hour } = this.parsedTime();

    if (this.format() === '12') {
      const h = hour % 12;
      return h === 0 ? 12 : h;
    }

    return hour;
  });

  readonly displayMinute = computed(() => {
    return this.parsedTime().minute;
  });

  readonly hourNumbers = computed(() => {
    if (this.format() === '24') {
      return Array.from({ length: 24 }, (_, i) => i);
    }

    return Array.from({ length: 12 }, (_, i) => i + 1);
  });

  readonly minuteNumbers = computed(() => {
    const step = Math.max(1, 5);

    const values: number[] = [];

    for (let i = 0; i < 60; i += step) {
      values.push(i);
    }

    return values;
  });

  readonly hourAngle = computed(() => {
    const { hour } = this.parsedTime();

    if (this.format() === '24') {
      /*
       * MUI-like 24 hour clock.
       *
       * 0 -> 0°
       * 6 -> 90°
       * 12 -> 180°
       * 18 -> 270°
       */
      return (hour % 12) * 30;
    }

    const h = hour % 12;

    return h * 30;
  });

  readonly minuteAngle = computed(() => {
    return this.parsedTime().minute * 6;
  });

  readonly currentAngle = computed(() => {
    return this.mode() === 'hour' ? this.hourAngle() : this.minuteAngle();
  });

  readonly handLength = computed(() => {
    if (this.mode() === 'hour' && this.format() === '24') {
      const hour = this.parsedTime().hour;

      if (hour >= 13 && hour <= 23) {
        return 58;
      }
    }

    return 86;
  });

  readonly handEnd = computed(() => {
    const angle = this.currentAngle();

    const radians = ((angle - 90) * Math.PI) / 180;

    const radius = this.handLength();

    return {
      x: 120 + Math.cos(radians) * radius,
      y: 120 + Math.sin(radians) * radius,
    };
  });

  readonly selectedPosition = computed(() => {
    const angle = this.currentAngle();

    const radians = ((angle - 90) * Math.PI) / 180;

    const radius = this.mode() === 'hour' ? 82 : 82;

    return {
      x: 120 + Math.cos(radians) * radius,
      y: 120 + Math.sin(radians) * radius,
    };
  });

  protected _onChange = (value: string) => {};
  protected _onTouched = () => {};
  protected _validatorOnChange = () => {};
  constructor() {}

  ngOnInit(): void {}

  writeValue(value: string): void {
    if (!value) value = '12:00';
    const s = value.split(':');
    if (this.format() == '12') {
      if (+s[0] > 12) {
        s[0] = (+s[0] - 12).toString().padStart(2, '0');
        this.amOrPm.set('PM');
      } else {
        this.amOrPm.set('AM');
      }
    }
    this.value.set(s.join(':') + ' ' + this.amOrPm());
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return null;
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
  }

  startPointer(event: PointerEvent): void {
    if (this.disabled()) {
      return;
    }

    event.preventDefault();

    this.dragging = true;

    const target = event.currentTarget as HTMLElement;

    target.setPointerCapture?.(event.pointerId);

    this.updateFromPointer(event);
  }

  movePointer(event: PointerEvent): void {
    if (!this.dragging || this.disabled()) {
      return;
    }

    event.preventDefault();

    this.updateFromPointer(event);
  }

  endPointer(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;

    const target = event.currentTarget as HTMLElement;

    target.releasePointerCapture?.(event.pointerId);

    if (this.mode() === 'hour' && this.autoSwitchToMinute()) {
      this.mode.set('minute');
    }
  }

  selectHour(hour: number): void {
    if (this.disabled()) {
      return;
    }

    let normalizedHour = hour;

    if (this.format() === '12') {
      const currentHour = this.parsedTime().hour;

      const isPm = currentHour >= 12;

      normalizedHour = hour === 12 ? (isPm ? 12 : 0) : isPm ? hour + 12 : hour;
    }

    this.setTime(normalizedHour, this.parsedTime().minute);

    if (this.autoSwitchToMinute()) {
      this.mode.set('minute');
    }
  }

  selectMinute(minute: number): void {
    if (this.disabled()) {
      return;
    }

    this.setTime(this.parsedTime().hour, minute);
  }

  setMode(mode: NgxTimePickerMode): void {
    if (!this.disabled()) {
      this.mode.set(mode);
    }
  }

  private updateFromPointer(event: PointerEvent): void {
    const svg = this.clock()?.nativeElement;

    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();

    /*
     * SVG viewBox = 0 0 240 240
     *
     * Convert browser coordinates
     * to SVG coordinates.
     */
    const x = ((event.clientX - rect.left) / rect.width) * 240;

    const y = ((event.clientY - rect.top) / rect.height) * 240;

    const dx = x - 120;
    const dy = y - 120;

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    if (angle < 0) {
      angle += 360;
    }

    if (this.mode() === 'hour') {
      this.updateHourFromAngle(angle);
    } else {
      this.updateMinuteFromAngle(angle);
    }
  }

  private updateHourFromAngle(angle: number): void {
    let hour = Math.round(angle / 30);

    if (hour === 0 || hour === 12) {
      hour = 12;
    }

    if (this.format() === '24') {
      /*
       * Determine whether pointer is closer
       * to inner or outer 12-hour ring.
       *
       * For a full 24-hour implementation we use
       * the current half-day when possible.
       */
      const currentHour = this.parsedTime().hour;

      const currentIsPm = currentHour >= 12;

      if (hour !== 12) {
        hour = currentIsPm ? hour + 12 : hour;
      } else {
        hour = currentIsPm ? 12 : 0;
      }
    }

    this.setTime(hour, this.parsedTime().minute);
  }

  private updateMinuteFromAngle(angle: number): void {
    let minute = Math.round(angle / 6);

    minute = minute % 60;

    const step = Math.max(1, this.minuteStep());

    minute = Math.round(minute / step) * step;

    if (minute >= 60) {
      minute = 0;
    }

    this.setTime(this.parsedTime().hour, minute);
  }

  private setTime(hour: number, minute: number): void {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');

    this.value.set(`${h}:${m}`);
  }

  isSelectedHour(hour: number): boolean {
    const current = this.displayHour();

    return current === hour;
  }

  isSelectedMinute(minute: number): boolean {
    return this.displayMinute() === minute;
  }

  formatHour(hour: number): string {
    if (this.format() === '24') {
      return String(hour).padStart(2, '0');
    }

    return String(hour);
  }

  formatMinute(minute: number): string {
    return String(minute).padStart(2, '0');
  }

  numberPosition(index: number, total: number, radius = 94): { x: number; y: number } {
    const angle = (index / total) * 360 - 90;

    const radians = (angle * Math.PI) / 180;

    return {
      x: 120 + Math.cos(radians) * radius,
      y: 120 + Math.sin(radians) * radius,
    };
  }

  hourPosition(hour: number, inner = false): { x: number; y: number } {
    const normalized = hour % 12;

    const angle = normalized * 30 - 90;

    const radians = (angle * Math.PI) / 180;

    const radius = inner ? 58 : 94;

    return {
      x: 120 + Math.cos(radians) * radius,
      y: 120 + Math.sin(radians) * radius,
    };
  }

  minutePosition(minute: number): {
    x: number;
    y: number;
  } {
    const angle = minute * 6 - 90;

    const radians = (angle * Math.PI) / 180;

    return {
      x: 120 + Math.cos(radians) * 94,
      y: 120 + Math.sin(radians) * 94,
    };
  }

  ok() {
    if (this.format() == '12') {
      this.value.update((u) => u + ` ${this.amOrPm()}`);
    }
    this.change.emit(this.value());
    this._onChange(this.value());
  }

  close() {
    this.cancel.emit();
  }
}
