import { Component } from '@angular/core';
import { moveItemInArray, NgxDraggable,  IDropEvent, NgxDropList } from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-copy-to-zone',
  imports: [NgxDraggable,NgxDropList],
  templateUrl: './copy-to-zone.component.html',
  styleUrl: './copy-to-zone.component.scss',
})
export class CopyToZoneComponent {
  sourceList: string[] = [];
  targetList: { id: string; title: string }[] = [];
  constructor() {
    this.sourceList = [];
    for (let i = 1; i < 80; i++) {
      this.sourceList.push('Item  ' + i);
    }
  }

  drop(event: IDropEvent) {
    console.log(event);
    if (event.previousContainer !== event.container) {
      const newItem = { id: this.generateId(), title: event.previousContainer.data[event.previousIndex] };
      event.container.data.splice(event.currentIndex, 0, newItem);
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  dropToDelete(event: IDropEvent) {
    event.container.data.splice(event.previousIndex, 1);
  }
  onClick(item: { id: string; title: string }) {
    console.log('Clicked item:', item);
  }
}
