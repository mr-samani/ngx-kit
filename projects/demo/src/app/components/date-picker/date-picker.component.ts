import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit, signal, viewChild } from '@angular/core';
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
    ExampleShowcaseComponent,
  ],
  providers: [
    provideDateAdapters({
      locale: 'jp',
      useClass: JapanesAdapter,
    }),
  ],
})
export class DatePickerComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/date-picker/date-picker.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/date-picker/date-picker.component.html', language: 'html' },
  ];

  locale: string = 'fa';
  availableLocals = getLocals();
  minDate?: Date; // = new Date('2023-03-02');
  maxDate?: Date; // = new Date('2023-03-17');

  config = signal<NgxDatePickerConfig>({
    todayButton: true,
    clearButton: true,
    clearButtonText: 'Clear',
    todayButtonText: 'Today',
  });

  form: FormGroup;
  inlineDate = viewChild<NgxInputDatePicker>('inlineDate');
  inputDate = viewChild<NgxInputDatePickerComponent>('inputDate');
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      date: ['', [Validators.required]],
    });
    // console.log('availableLocals', this.availableLocals);
  }

  ngOnInit(): void {}
  updateConfig() {
    const inline = this.inlineDate();
    const input = this.inputDate();
    inline?.updateConfig(this.config());
    input?.updateConfig(this.config());
  }
}
