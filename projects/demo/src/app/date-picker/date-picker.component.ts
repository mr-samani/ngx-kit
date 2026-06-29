import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgxCalendarComponent,
  NgxDatePickerConfig,
  NgxInputDatePicker,
  NgxInputDatePickerComponent,
} from 'ngx-kit/date-picker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputDatePicker,
    NgxInputDatePickerComponent,
    NgxCalendarComponent,
  ],
})
export class DatePickerComponent implements OnInit {
  locale: 'fa' | 'en' = 'en';
  minDate?: Date; // = new Date('2023-03-02');
  maxDate?: Date; // = new Date('2023-03-17');

  config: NgxDatePickerConfig = {
    todayButton: true,
    clearButton: true,
    clearButtonText: 'Clear',
    todayButtonText: 'Today',
  };

  form: FormGroup;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  updateDatepicker(dpInput: NgxInputDatePicker) {
    dpInput.updateValue(this.form.get('date')?.value);
  }
}
