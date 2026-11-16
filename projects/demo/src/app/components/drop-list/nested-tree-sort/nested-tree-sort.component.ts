import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  NgxDraggable,
  NgxDropList,
  transferArrayItem,
  IDropEvent,
  NgxDropListGroup,
} from 'ngx-kit/drag-resize';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../../shared/showcase/example-showcase.component';

export interface TreeModel {
  name: string;
  children: TreeModel[];
}

@Component({
  selector: 'app-nested-tree-sort',
  imports: [CommonModule, NgxDraggable, NgxDropList, NgxDropListGroup, ExampleShowcaseComponent],
  templateUrl: './nested-tree-sort.component.html',
  styleUrl: './nested-tree-sort.component.scss',
})
export class NestedTreeSortComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/drop-list/nested-tree-sort/nested-tree-sort.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/drop-list/nested-tree-sort/nested-tree-sort.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/drop-list/nested-tree-sort/nested-tree-sort.component.scss',
      language: 'scss',
    },
  ];

  items: TreeModel[] = [
    {
      name: 'Item 0',
      children: [],
    },
    {
      name: 'Item 1',
      children: [
        {
          name: 'Item 4',
          children: [],
        },
        {
          name: 'Item 6',
          children: [],
        },
        {
          name: 'Item 5',
          children: [],
        },
      ],
    },
    {
      name: 'Item 2',
      children: [],
    },
    {
      name: 'Item 3',
      children: [],
    },
    {
      name: 'Item 7',
      children: [],
    },
    {
      name: 'Item 8',
      children: [],
    },
    {
      name: 'Item 9',
      children: [],
    },
  ];

  constructor() {
    if (!this.items.length)
      for (let i = 0; i < 10; i++) {
        this.items.push({
          name: 'Item ' + i,
          children: [],
        });
      }
  }

  add() {
    let rndPosition = Math.floor(Math.random() * this.items.length);
    let rndName = 'added item_' + Math.round(Math.random() * 9999);
    this.items.splice(rndPosition, 0, { name: rndName, children: [] });
  }

  drop(event: IDropEvent) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
}
