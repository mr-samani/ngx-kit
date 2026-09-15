import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
import { NgxShadowBox } from 'ngx-kit/box-shadow';

@Component({
  selector: 'app-box-shadow',
  templateUrl: './box-shadow.component.html',
  styleUrls: ['./box-shadow.component.scss'],
  imports: [FormsModule, NgxShadowBox, ExampleShowcaseComponent],
})
export class BoxShadowComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/box-shadow/box-shadow.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/box-shadow/box-shadow.component.html', language: 'html' },
  ];

  boxShadow = signal(
    '2px -3px 10px 0px #015870, -5px 6px 10px 0px #fa000080, -4px -3px 10px 0px #04e00080, 7px 8px 10px 0px #eb00d780',
  );

  constructor() {}

  ngOnInit() {}
}
