import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideTimePicker } from '../providers/provide-time-picker';
import { DEFAULT_TIME_PICKER_CONFIG, NGX_TIME_PICKER_CONFIG } from '../types/config';

describe('provideTimePicker', () => {
  it('should register NGX_TIME_PICKER_CONFIG as a single value, not a multi-provider array', () => {
    // این تستِ رگرسیونِ باگیه که پیدا و رفع شد: قبلاً provideTimePicker با
    // multi:true رجیستر می‌شد، در حالی که NGX_TIME_PICKER_CONFIG یک
    // InjectionToken تک‌مقداره‌ست (کامپوننت/دایرکتیو مستقیم روی
    // this.config.format و ... دسترسی دارن) — یعنی inject کردنش یا یک
    // آرایه برمی‌گردوند یا اصلاً throw می‌کرد.
    TestBed.configureTestingModule({
      providers: [provideTimePicker({ format: '24' })],
    });

    const config = TestBed.inject(NGX_TIME_PICKER_CONFIG);

    expect(Array.isArray(config)).toBe(false);
    expect(config.format).toBe('24');
  });

  it('should shallow-merge the given config over the defaults', () => {
    TestBed.configureTestingModule({
      providers: [provideTimePicker({ confirmButtonText: 'Done' })],
    });

    const config = TestBed.inject(NGX_TIME_PICKER_CONFIG);

    expect(config.confirmButtonText).toBe('Done');
    expect(config.cancelButtonText).toBe(DEFAULT_TIME_PICKER_CONFIG.cancelButtonText);
    expect(config.format).toBe(DEFAULT_TIME_PICKER_CONFIG.format);
  });

  it('should fall back to DEFAULT_TIME_PICKER_CONFIG when provideTimePicker is not used at all', () => {
    TestBed.configureTestingModule({ providers: [] });
    const config = TestBed.inject(NGX_TIME_PICKER_CONFIG);
    expect(config).toEqual(DEFAULT_TIME_PICKER_CONFIG);
  });
});
