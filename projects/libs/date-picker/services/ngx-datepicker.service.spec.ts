import { TestBed } from '@angular/core/testing';

import { NgxInputDatePickerService } from './ngx-datepicker.service';

describe('NgxInputDatePickerService', () => {
  let service: NgxInputDatePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxInputDatePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
