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

  fileList = [
    'audio/CottonEyeJoe.ogg',
    "audio/It's_a_Long,_Long_Way_to_Tipperary_(1915).ogg",
    'audio/La_Partida.ogg',
    'audio/The_Entertainer_-_Scott_Joplin.ogg',
  ];
  constructor() {}

  ngOnInit() {}
}
