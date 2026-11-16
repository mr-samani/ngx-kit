import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputGradient, NgxInputGradientComponent } from 'ngx-kit/gradient-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-gradient-picker',
  templateUrl: './gradient-picker.component.html',
  imports: [FormsModule, NgxInputGradient, ExampleShowcaseComponent],
})
export class GradientPickerComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/gradient-picker/gradient-picker.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/gradient-picker/gradient-picker.component.html',
      language: 'html',
    },
  ];

  gradient = 'linear-gradient(90deg, #f8b34b 0%, #ef5da8 48%, #635bff 100%)';
  showSamples = true;
 

  clear(): void {
    this.gradient = '';
  }
}
