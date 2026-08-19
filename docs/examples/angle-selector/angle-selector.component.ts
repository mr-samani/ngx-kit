import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputAngle, NgxAngleSelectorComponent } from 'ngx-kit/angle-selector';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-angle-selector',
  templateUrl: './angle-selector.component.html',
  styleUrls: ['./angle-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxInputAngle,
    NgxAngleSelectorComponent,
    ExampleShowcaseComponent,
  ],
})
export class AngleSelectorComponent implements OnInit {
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
  constructor() {}

  ngOnInit() {}
}
