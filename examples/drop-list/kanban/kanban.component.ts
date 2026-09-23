import { Component } from '@angular/core';
import { moveItemInArray, NgxDraggable, NgxDropList, transferArrayItem, IDropEvent, NgxDropListGroup, NgxPlaceholder } from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-drag-drop',
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup, NgxPlaceholder],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class DemoKanbanComponent {
  inProgressList: string[] = [];
  completedList: string[] = [];
  failedList: string[] = [];
  todoList: string[] = [];

  constructor() {
    this.todoList = [];
    for (let i = 0; i < 5; i++) {
      this.todoList.push('Episode ' + i);
    }
  }

  add() {
    let rndPosition = Math.floor(Math.random() * this.todoList.length);
    let rndName = 'added item_' + Math.round(Math.random() * 9999);
    this.todoList.splice(rndPosition, 0, rndName);
  }

  drop(event: IDropEvent) {
    console.log('dropEvent', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
