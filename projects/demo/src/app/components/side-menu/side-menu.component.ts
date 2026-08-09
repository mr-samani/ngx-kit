import { Component, signal } from '@angular/core';
import { NgxSideMenuComponent } from 'ngx-kit/side-menu';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  imports: [NgxSideMenuComponent, ExampleShowcaseComponent],
})
export class SideMenuComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/side-menu/side-menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/side-menu/side-menu.component.html', language: 'html' },
  ];

  protected readonly startOpen = signal(false);
  protected readonly endOpen = signal(false);
}
