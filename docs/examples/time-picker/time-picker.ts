import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxInputTimePicker, NgxInputTimePickerComponent } from 'ngx-kit/time-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExampleShowcaseComponent,
    NgxInputTimePicker,
    NgxInputTimePickerComponent,
  ],
  providers: [],
})
export class TimePickerComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/time-picker/time-picker.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/time-picker/time-picker.html', language: 'html' },
  ];

  form: FormGroup;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      time: [undefined, [Validators.required]],
    });
  }

  ngOnInit(): void {}
}
