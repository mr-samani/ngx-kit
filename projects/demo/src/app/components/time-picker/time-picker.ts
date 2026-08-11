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
import { NgxFormField } from "ngx-kit/form-field";
import { NgxInput } from "ngx-kit/form-field/directives/ngx-input.directive";
import { NgxSuffix } from "ngx-kit/form-field/directives/ngx-suffix.directive";
import { NgxPrefix } from "ngx-kit/form-field/directives/ngx-prefix.directive";

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
    NgxFormField,
    NgxInput,
    NgxSuffix,
    NgxPrefix
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
