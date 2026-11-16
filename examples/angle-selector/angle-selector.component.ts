import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputAngle, NgxAngleSelectorComponent } from 'ngx-kit/angle-selector';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-angle-selector',
  templateUrl: './angle-selector.component.html',
  imports: [FormsModule, NgxInputAngle, NgxAngleSelectorComponent, ExampleShowcaseComponent],
})
export class AngleSelectorComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/angle-selector/angle-selector.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/angle-selector/angle-selector.component.html',
      language: 'html',
    },
  ];

  angle = 135;

  setAngle(value: number): void {
    this.angle = ((value % 360) + 360) % 360;
  }
}
