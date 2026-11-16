import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxShadowBox } from 'ngx-kit/box-shadow';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-box-shadow',
  templateUrl: './box-shadow.component.html',
  imports: [FormsModule, NgxShadowBox, ExampleShowcaseComponent],
})
export class BoxShadowComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/box-shadow/box-shadow.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/box-shadow/box-shadow.component.html', language: 'html' },
  ];

  readonly defaultShadow =
    '2px -3px 10px 0px #015870, -5px 6px 10px 0px #fa000080, -4px -3px 10px 0px #04e00080, 7px 8px 10px 0px #eb00d780';
  readonly softShadow = '0 16px 40px rgba(99, 91, 255, 0.28)';
  readonly insetShadow = 'inset 0 2px 12px rgba(15, 23, 42, 0.35)';

  boxShadow = signal(this.defaultShadow);
}
