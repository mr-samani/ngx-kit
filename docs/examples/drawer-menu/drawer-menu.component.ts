import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxDrawerMenuComponent,
  NgxDrawerContentBehavior,
  NgxDrawerEffect,
} from 'ngx-kit/drawer-menu';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  imports: [FormsModule, NgxDrawerMenuComponent, ExampleShowcaseComponent],
})
export class DrawerMenuComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/drawer-menu/drawer-menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/drawer-menu/drawer-menu.component.html', language: 'html' },
  ];

  protected readonly effects: NgxDrawerEffect[] = [
    'slide',
    'curtain',
    'jelly',
    'pull',
    'rotate3d',
    'flip3d',
    'scale',
  ];
  protected readonly behaviors: NgxDrawerContentBehavior[] = ['overlay', 'push', 'reveal'];

  protected readonly effect = signal<NgxDrawerEffect>('jelly');
  protected readonly behavior = signal<NgxDrawerContentBehavior>('overlay');
  protected readonly open = signal(false);
}
