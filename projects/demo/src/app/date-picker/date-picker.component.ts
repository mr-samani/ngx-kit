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
  getLocals,
  NgxDatePickerConfig,
  NgxInputDatePicker,
  NgxInputDatePickerComponent,
  provideDateAdapters,
} from 'ngx-kit/date-picker';
import { HijriAdapter } from './custom-adapters/hijri-adapter';

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
  ],
  providers: [
    provideDateAdapters({
      locale: 'hi',
      useClass: HijriAdapter,
    }),
  ],
})
export class DatePickerComponent implements OnInit {
  locale: string = 'en';
  availableLocals = getLocals();
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
    console.log('availableLocals', this.availableLocals);
  }

  ngOnInit(): void {}
}
