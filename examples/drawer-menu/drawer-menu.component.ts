import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
import { NgxSideNavModule, NgxSideNavMode } from 'ngx-kit/side-nav';

@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  imports: [FormsModule, ExampleShowcaseComponent, NgxSideNavModule],
})
export class DrawerMenuComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/drawer-menu/drawer-menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/drawer-menu/drawer-menu.component.html', language: 'html' },
  ];

  mode = signal<NgxSideNavMode>('push');

  setMode(m: NgxSideNavMode) {
    this.mode.set(m);
  }
}
