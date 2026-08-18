import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxInputDatePickerComponent } from './ngx-datepicker.component';

describe('NgxInputDatePickerComponent', () => {
  let component: NgxInputDatePickerComponent;
  let fixture: ComponentFixture<NgxInputDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxInputDatePickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxInputDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
