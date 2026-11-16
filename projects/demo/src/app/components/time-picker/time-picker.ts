import { Component } from '@angular/core';
import {
  FormControl,
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
    FormsModule,
    ReactiveFormsModule,
    ExampleShowcaseComponent,
    NgxInputTimePicker,
    NgxInputTimePickerComponent,
  ],
})
export class TimePickerComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/time-picker/time-picker.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/time-picker/time-picker.html', language: 'html' },
  ];

  readonly form = new FormGroup({
    time: new FormControl<string | null>('09:30', Validators.required),
  });

  format: '12' | '24' = '12';
  inlineTime = '14:30';
 
}
