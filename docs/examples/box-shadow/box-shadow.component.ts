import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxBoxShadowComponent, NgxInputBoxShadow } from 'ngx-kit/box-shadow';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-box-shadow',
  templateUrl: './box-shadow.component.html',
  styleUrls: ['./box-shadow.component.scss'],
  imports: [FormsModule, NgxInputBoxShadow, NgxBoxShadowComponent, ExampleShowcaseComponent],
})
export class BoxShadowComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/box-shadow/box-shadow.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/box-shadow/box-shadow.component.html', language: 'html' },
  ];

  boxShadow = '50px 150px 10px 0px red';

  constructor() {}

  ngOnInit() {}
}
