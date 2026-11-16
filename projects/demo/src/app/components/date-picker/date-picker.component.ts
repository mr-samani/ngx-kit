import { CommonModule } from '@angular/common';
import { Component, signal, viewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getLocals,
  NgxDateConfig,
  NgxInputDatePicker,
  NgxInputDatePickerComponent,
  NgxInputDateRangePicker,
  provideDateAdapters,
} from 'ngx-kit/date-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputDatePicker,
    NgxInputDatePickerComponent,
    NgxInputDateRangePicker,
    ExampleShowcaseComponent,
  ],
  providers: [provideDateAdapters()],
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

  locale = 'en';
  availableLocals = getLocals();
 
  minDate?: Date;
  maxDate?: Date;

  readonly config = signal<NgxDateConfig>({
    todayButton: true,
    clearButton: true,
  });

  readonly form = new FormGroup({
    date: new FormControl<Date | null>(null, Validators.required),
  });

  readonly today = new Date();
  dateRange: [Date, Date] = [
    this.today,
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
  ];

  readonly inlineDate = viewChild<NgxInputDatePicker>('inlineDate');
  readonly inputDate = viewChild<NgxInputDatePickerComponent>('inputDate');

  updateConfig(key: 'todayButton' | 'clearButton', value: boolean): void {
    this.config.update((current) => ({ ...current, [key]: value }));
    this.inlineDate()?.updateConfig(this.config());
    this.inputDate()?.updateConfig(this.config());
  }
}
