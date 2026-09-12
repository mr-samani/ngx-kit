import { Component, OnInit, signal } from '@angular/core';
import {
  NgxDraggable,
  NgxDropList,
  NgxDropListGroup,
  transferArrayItem,
  type IDropEvent,
} from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.scss'],
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup],
})
export class KanbanViewComponent implements OnInit {
  todo = signal<string[]>([]);
  progress = signal<string[]>([]);
  done = signal<string[]>([]);
  stoped = signal<string[]>([]);

  constructor() {
    this.todo.set(Array.from({ length: 10 }).map((m, i) => (m = 'item ' + i)));
  }

  ngOnInit() {}

  onDrop(ev: IDropEvent) {
    console.log('on drop', ev);
    transferArrayItem(
      ev.previousContainer.data,
      ev.container.data,
      ev.previousIndex,
      ev.currentIndex,
    );
  }
}
