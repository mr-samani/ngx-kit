import { describe, expect, it, vi } from 'vitest';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { NgxInputTimePicker } from '../directives/time-picker.directive';

@Component({
  standalone: true,
  imports: [FormsModule, NgxInputTimePicker],
  template: `<input ngxInputTimePicker [(ngModel)]="value" [openOnCLick]="false" #dp="ngxInputTimePicker" />`,
})
class HostComponent {
  value: string | null = null;
}

describe('NgxInputTimePicker directive', () => {
  let fixture: ComponentFixture<HostComponent>;
  let inputEl: DebugElement;
  let directive: NgxInputTimePicker;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.directive(NgxInputTimePicker));
    directive = inputEl.injector.get(NgxInputTimePicker);
  });

  it('writeValue should set the native input value (via _formatValue)', () => {
    directive.writeValue('09:30');
    expect((inputEl.nativeElement as HTMLInputElement).value).toBe('09:30');
  });

  describe('validate() — the fix for the always-null bug', () => {
    it('should return null for an empty value (Validators.required handles that separately)', () => {
      directive.writeValue('');
      expect(directive.validate({} as any)).toBeNull();
    });

    it('should return null for a well-formed time', () => {
      directive.writeValue('09:30');
      expect(directive.validate({} as any)).toBeNull();
    });

    it('should return { invalid: true } for a malformed time string', () => {
      directive.writeValue('99:99');
      expect(directive.validate({} as any)).toEqual({ invalid: true });
    });

    it('should return { invalid: true } for garbage input typed by the user', () => {
      directive.writeValue('not-a-time');
      expect(directive.validate({} as any)).toEqual({ invalid: true });
    });
  });

  describe('ControlValueAccessor', () => {
    it('typing in the input should propagate through registerOnChange', () => {
      const onChange = vi.fn();
      directive.registerOnChange(onChange);

      const native = inputEl.nativeElement as HTMLInputElement;
      native.value = '10:15';
      native.dispatchEvent(new Event('input'));

      expect(onChange).toHaveBeenCalledWith('10:15');
    });

    it('blur should call the registered onTouched', () => {
      const onTouched = vi.fn();
      directive.registerOnTouched(onTouched);

      (inputEl.nativeElement as HTMLInputElement).dispatchEvent(new Event('blur'));

      expect(onTouched).toHaveBeenCalled();
    });

    it('setDisabledState(true) should set the native disabled attribute', () => {
      directive.setDisabledState(true);
      expect((inputEl.nativeElement as HTMLInputElement).disabled).toBe(true);

      directive.setDisabledState(false);
      expect((inputEl.nativeElement as HTMLInputElement).hasAttribute('disabled')).toBe(false);
    });
  });

  it('clicking the input should not open the picker when openOnCLick is false', () => {
    const toggleSpy = vi.spyOn(directive, 'toggle');
    (inputEl.nativeElement as HTMLInputElement).dispatchEvent(new MouseEvent('click'));
    expect(toggleSpy).not.toHaveBeenCalled();
  });
});
