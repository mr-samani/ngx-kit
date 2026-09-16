import { CommonModule } from '@angular/common';
import { Component, signal, viewChild } from '@angular/core';
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
  NgxInputDateRangePicker,
  provideDateAdapters,
} from 'ngx-kit/date-picker';

import { JapanesAdapter } from './custom-adapters/japanes-adapter';

import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

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
    NgxInputDateRangePicker,
    ExampleShowcaseComponent,
  ],
  providers: [
    provideDateAdapters({
      locale: 'jp',
      useClass: JapanesAdapter,
    }),
  ],
})
export class DatePickerComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/date-picker/date-picker.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/date-picker/date-picker.component.html',
      language: 'html',
    },
  ];

  locale = 'fa';

  availableLocals = getLocals();

  minDate?: Date;

  maxDate?: Date;

  config = signal<NgxDatePickerConfig>({
    todayButton: true,
    clearButton: true,
  });

  form: FormGroup;

  inlineDate = viewChild<NgxInputDatePicker>('inlineDate');

  inputDate = viewChild<NgxInputDatePickerComponent>('inputDate');

  today = new Date();

  dateRange = [
    this.today,
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
  ];

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      date: ['', Validators.required],
    });
  }

  updateConfig(): void {
    const config = this.config();

    this.inlineDate()?.updateConfig(config);
    this.inputDate()?.updateConfig(config);
  }
}
