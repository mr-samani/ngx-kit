import { Component } from '@angular/core';
import {
  ExampleShowcaseComponent,
  type ExampleSourceFile,
} from '@demo/shared/showcase/example-showcase.component';
import { NgxMediaControl, NgxMediaSource } from 'ngx-kit/media-control';

@Component({
  selector: 'app-media-control',
  templateUrl: './media-control.component.html',
  styleUrls: ['./media-control.component.scss'],
  imports: [ExampleShowcaseComponent, NgxMediaControl],
})
export class DemoMediaControlComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/media-control/media-control.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/media-control/media-control.component.html',
      language: 'html',
    },
  ];

  /** Native audio playlist — same fast path as the old audio-control demo. */
  protected readonly audioPlaylist: NgxMediaSource[] = [
    { src: 'audio/Free_Test_Data_500KB_MP3.mp3' },
    { src: 'audio/CottonEyeJoe.ogg', title: 'Cotton Eye Joe', type: 'audio/ogg' },
    { src: 'audio/La_Partida.ogg', title: 'La Partida', type: 'audio/ogg' },
    {
      src: "audio/It's_a_Long,_Long_Way_to_Tipperary_(1915).ogg",
      title: "It's a Long, Long Way to Tipperary (1915)",
      type: 'audio/ogg',
    },
    {
      src: 'audio/The_Entertainer_-_Scott_Joplin.ogg',
      title: 'The Entertainer - Scott Joplin',
      type: 'audio/ogg',
    },
  ];

  /** Video, native MP4 — fullscreen/PiP controls appear automatically when the browser supports them. */
  protected readonly videoSource: NgxMediaSource[] = [
    {
      src: 'video/file_example_MP4_640_3MG.mp4',
      title: 'Sample clip',
      type: 'video/mp4',
      poster: 'video/sample-poster.jpg',
    },
  ];

  onTrackChange(source: NgxMediaSource): void {
    console.log('Now playing:', source.title);
  }

  onError(message: string): void {
    console.error('Media error:', message);
  }
}

/**
 * Registering a custom decoder (see README "Custom decoder development").
 * Not wired into this demo's DI by default — shown here as the exact shape
 * a consumer adds to their own `bootstrapApplication` providers:
 *
 * ```ts
 * import { provideNgxMediaDecoder, NgxMediaDecoder, NgxMediaSource } from 'ngx-kit/media-control';
 *
 * class My3gpDecoder implements NgxMediaDecoder {
 *   readonly id = '3gp';
 *   readonly formats = ['3gp'];
 *   canDecode(source: NgxMediaSource) {
 *     return source.type === 'video/3gpp';
 *   }
 *   async createEngine(source: NgxMediaSource) {
 *     // build/return an NgxMediaEngine backed by your codec of choice
 *   }
 *   destroy() {}
 * }
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNgxMediaDecoder(My3gpDecoder)],
 * });
 * ```
 */
