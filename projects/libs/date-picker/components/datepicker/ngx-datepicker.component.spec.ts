import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxInputDatePickerComponent } from './ngx-datepicker.component';
import { DATE_ADAPTERS } from '../../adapters/consts';
import { GregorianAdapter } from '../../adapters/locales/gregorian.adapter';

describe('NgxInputDatePickerComponent', () => {
  let component: NgxInputDatePickerComponent;
  let fixture: ComponentFixture<NgxInputDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxInputDatePickerComponent],
      providers: [
        { provide: DATE_ADAPTERS, useValue: [{ locale: 'en', useClass: GregorianAdapter }] },
      ],
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
