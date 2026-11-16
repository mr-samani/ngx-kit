import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { IDropEvent, moveItemInArray, NgxDraggable, NgxDropList } from 'ngx-kit/drag-resize';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-dynamic-html',
  templateUrl: './dynamic-html.component.html',
  styleUrls: ['./dynamic-html.component.scss'],
  imports: [NgxDraggable, NgxDropList, JsonPipe, ExampleShowcaseComponent],
})
export class DynamicHtmlComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/drop-list/dynamic-html/dynamic-html.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/drop-list/dynamic-html/dynamic-html.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/drop-list/dynamic-html/dynamic-html.component.scss',
      language: 'scss',
    },
  ];

  items: {
    title: string;
    tag: string;
  }[] = [];
  constructor() {
    this.items = [];
    for (let i = 0; i <= 8; i++) {
      this.items.push({
        title: 'report element ' + i,
        tag: ['div', 'input', 'button'][Math.floor(Math.random() * 3)],
      });
    }
  }

  drop<T>(ev: IDropEvent, list: T[]) {
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
  }

  alert(txt: string) {
    window.alert(txt);
  }
}
