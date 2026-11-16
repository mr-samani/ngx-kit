import { Component } from '@angular/core';
import {
  IDropEvent,
  moveItemInArray,
  NgxDraggable,
  NgxDragPreview,
  NgxDropList,
  NgxPlaceholder,
} from 'ngx-kit/drag-resize';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-sort-list',
  imports: [NgxDraggable, NgxDropList, NgxDragPreview, NgxPlaceholder, ExampleShowcaseComponent],
  templateUrl: './sort-list.component.html',
  styleUrl: './sort-list.component.scss',
})
export class SortListComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/drop-list/sort-list/sort-list.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/drop-list/sort-list/sort-list.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/drop-list/sort-list/sort-list.component.scss',
      language: 'scss',
    },
  ];

  items: string[] = Array.from({ length: 30 }).map((m, i) => 'Item ' + i);
  items2: { id: string; title: string; size: number }[] = Array.from({ length: 5 }).map((m, i) => ({
    id: 'item_' + i,
    title: 'Item ' + i,
    size: [25, 50, 100, 150][Math.floor(Math.random() * 4)],
  }));

  constructor() {}

  add() {
    let rndPosition = Math.floor(Math.random() * this.items.length);
    let rndName = 'added item_' + Math.round(Math.random() * 9999);
    this.items.splice(rndPosition, 0, rndName);
  }

  drop<T>(ev: IDropEvent, list: T[]) {
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
  }
}
