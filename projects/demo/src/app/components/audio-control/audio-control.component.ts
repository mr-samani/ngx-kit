import { Component, OnInit } from '@angular/core';
import {
  ExampleShowcaseComponent,
  type ExampleSourceFile,
} from '@demo/shared/showcase/example-showcase.component';
import { NgxAudioControl } from 'ngx-kit/audio-control';

@Component({
  selector: 'app-audio-control',
  templateUrl: './audio-control.component.html',
  styleUrls: ['./audio-control.component.scss'],
  imports: [ExampleShowcaseComponent, NgxAudioControl],
})
export class DemoAudioControlComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/audio-control/audio-control.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/audio-control/audio-control.component.html',
      language: 'html',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
