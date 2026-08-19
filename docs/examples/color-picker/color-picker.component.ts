import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorInspector, NgxInputColor, OutputType } from 'ngx-kit/color-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  imports: [FormsModule, NgxInputColor, ExampleShowcaseComponent],
})
export class ColorPickerComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/color-picker/color-picker.component.ts',
      language: 'typescript',
    },
    { label: 'HTML', path: 'examples/color-picker/color-picker.component.html', language: 'html' },
  ];

  color = 'pink';

  theme: 'light' | 'dark' | 'auto' = 'auto';
  outputType: OutputType = 'HEX';
  simpleMode = false;
  inspector: ColorInspector = ColorInspector.Picker;

  useAlphaChannel = true;
  constructor() {}

  ngOnInit() {}
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
}
