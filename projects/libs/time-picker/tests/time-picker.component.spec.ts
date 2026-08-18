import { describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxInputTimePickerComponent } from '../components/time-picker/time-picker';

describe('NgxInputTimePickerComponent', () => {
  let fixture: ComponentFixture<NgxInputTimePickerComponent>;
  let component: NgxInputTimePickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxInputTimePickerComponent],
    });
    fixture = TestBed.createComponent(NgxInputTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default to 12:00', () => {
    expect(component.value()).toBe('12:00');
    expect(component.parsedTime()).toEqual({ hour: 12, minute: 0 });
  });

  it('should default to 12h format (from DEFAULT_TIME_PICKER_CONFIG)', () => {
    expect(component.format()).toBe('12');
  });

  describe('writeValue / normalizeTime integration', () => {
    it('should accept and normalize a valid time', () => {
      component.writeValue('9:5'.replace('5', '05')); // '9:05'
      expect(component.value()).toBe('09:05');
    });

    it('should reset to 12:00 for an empty/falsy value', () => {
      component.writeValue('18:30');
      component.writeValue('');
      expect(component.value()).toBe('12:00');
    });

    it('should silently ignore an invalid value (keep the previous one)', () => {
      component.writeValue('18:30');
      component.writeValue('99:99');
      expect(component.value()).toBe('18:30');
    });
  });

  describe('displayHour (12h format)', () => {
    it('should show 12 for midnight (hour 0)', () => {
      component.writeValue('00:15');
      expect(component.displayHour()).toBe(12);
      expect(component.isPm()).toBe(false);
    });

    it('should show 12 for noon (hour 12) and mark it as PM', () => {
      component.writeValue('12:00');
      expect(component.displayHour()).toBe(12);
      expect(component.isPm()).toBe(true);
    });

    it('should show the 1-11 hour as-is for both AM and PM', () => {
      component.writeValue('03:00');
      expect(component.displayHour()).toBe(3);
      expect(component.isPm()).toBe(false);

      component.writeValue('15:00'); // 3 PM
      expect(component.displayHour()).toBe(3);
      expect(component.isPm()).toBe(true);
    });
  });

  describe('selectHour (12h format)', () => {
    it('picking hour 5 while currently AM should stay AM (05:xx)', () => {
      component.writeValue('09:20');
      component.selectHour(5);
      expect(component.value()).toBe('05:20');
    });

    it('picking hour 5 while currently PM should stay PM (17:xx)', () => {
      component.writeValue('21:20'); // 9 PM
      component.selectHour(5);
      expect(component.value()).toBe('17:20');
    });

    it('picking 12 while AM should map to hour 0 (12 AM = midnight)', () => {
      component.writeValue('05:00');
      component.selectHour(12);
      expect(component.value()).toBe('00:00');
    });

    it('picking 12 while PM should map to hour 12 (12 PM = noon)', () => {
      component.writeValue('17:00');
      component.selectHour(12);
      expect(component.value()).toBe('12:00');
    });

    it('should switch to minute mode after selecting an hour when autoSwitchToMinute is on', () => {
      expect(component.autoSwitchToMinute()).toBe(true);
      component.selectHour(6);
      expect(component.mode()).toBe('minute');
    });

    it('should do nothing when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      component.writeValue('09:20');
      component.selectHour(5);
      expect(component.value()).toBe('09:20');
    });
  });

  describe('selectMinute', () => {
    it('should update only the minute, keeping the hour', () => {
      component.writeValue('09:00');
      component.selectMinute(45);
      expect(component.value()).toBe('09:45');
    });
  });

  describe('togglePmAm', () => {
    it('AM on a PM time should subtract 12 hours', () => {
      component.writeValue('14:10'); // 2 PM
      component.togglePmAm('AM');
      expect(component.value()).toBe('02:10');
    });

    it('PM on an AM time should add 12 hours', () => {
      component.writeValue('02:10');
      component.togglePmAm('PM');
      expect(component.value()).toBe('14:10');
    });

    it('AM on an already-AM time should be a no-op', () => {
      component.writeValue('02:10');
      component.togglePmAm('AM');
      expect(component.value()).toBe('02:10');
    });
  });

  describe('hourAngle / minuteAngle', () => {
    it('minute angle should be minute * 6 degrees', () => {
      component.writeValue('09:15');
      expect(component.minuteAngle()).toBe(90);
    });

    it('hour angle (12h) should be (hour % 12) * 30 degrees', () => {
      component.writeValue('03:00');
      expect(component.hourAngle()).toBe(90);
      component.writeValue('12:00'); // 12 % 12 = 0
      expect(component.hourAngle()).toBe(0);
    });
  });

  describe('ControlValueAccessor wiring', () => {
    it('ok() should call the registered onChange with the current value and emit `change`', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      const changeSpy = vi.fn();
      component.change.subscribe(changeSpy);

      component.writeValue('08:30');
      component.ok();

      expect(onChange).toHaveBeenCalledWith('08:30');
      expect(changeSpy).toHaveBeenCalledWith('08:30');
    });

    it('close() should emit `cancel`', () => {
      const cancelSpy = vi.fn();
      component.cancel.subscribe(cancelSpy);
      component.close();
      expect(cancelSpy).toHaveBeenCalled();
    });

    it('setDisabledState should update isDisabled', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });
  });
});
