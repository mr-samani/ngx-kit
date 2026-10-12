import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, inject, Renderer2, signal } from '@angular/core';
import { NgxMenuModule } from 'ngx-kit/menu';
import { Notify } from 'ngx-kit/notify';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-menu',
  imports: [NgxMenuModule, CommonModule, ExampleShowcaseComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected readonly doc = inject(DOCUMENT);

  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/menu/menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/menu/menu.component.html', language: 'html' },
  ];

  action(act: string) {
    Notify.info(`Clicked on "${act}"!`);
  }

  toggleFulScreenMenu() {
    this.doc.querySelector('.ngx-menu-overlay')?.classList.toggle('full-screen');
  }
}
