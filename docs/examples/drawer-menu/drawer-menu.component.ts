import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDrawerMenuComponent, NgxDrawerEffect } from 'ngx-kit/drawer-menu';
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
    { label: 'TS', path: 'examples/drawer-menu/drawer-menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/drawer-menu/drawer-menu.component.html', language: 'html' },
  ];

  protected readonly effects: NgxDrawerEffect[] = [
    'slide',
    'curtain',
    'slide',
    'spring',
    'fabric',
    'curtain',
    'elastic',
    'reveal',
  ];

  protected readonly effect = signal<NgxDrawerEffect>('fabric');
  protected readonly open = signal(false);
}
