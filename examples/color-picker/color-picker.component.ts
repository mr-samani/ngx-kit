import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorInspector, NgxInputColor, OutputType } from 'ngx-kit/color-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  imports: [CommonModule, FormsModule, NgxInputColor, ExampleShowcaseComponent],
})
export class ColorPickerComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/color-picker/color-picker.component.ts',
      language: 'typescript',
    },
    { label: 'HTML', path: 'examples/color-picker/color-picker.component.html', language: 'html' },
  ];

  color = model<string>('#a855f7');
  outputType: OutputType = 'HEX';
  simpleMode = false;
  inspector: ColorInspector = ColorInspector.Picker;
  useAlphaChannel = true;
 

  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
}
