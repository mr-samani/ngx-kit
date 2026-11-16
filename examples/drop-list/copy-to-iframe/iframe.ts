import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { moveItemInArray, NgxDraggable, NgxDropList, type IDropEvent } from 'ngx-kit/drag-resize';

@Component({
  template: `
    <div
      class="inner"
      id="copyZone"
      #copyZone
      ngxDropList
      [data]="targetList()"
      (drop)="drop($event)">
      @for (item of targetList(); track item.id) {
        <div class="example-box" ngxDraggable (click)="onClick(item)" [id]="item.id">
          {{ item.title }}
        </div>
      }
    </div>
  `,
  imports: [NgxDropList, NgxDraggable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .inner {
      background-color: var(--iframe-surface-2);
      min-height: 100px;
      display: flex;
      align-items: flex-start;
      flex-direction: row;
      align-content: flex-start;
      flex-wrap: wrap;
      gap: 5px;
      padding: 5px;
      height: 100%;
      border: 1px solid var(--iframe-border);
    }
    .example-box {
      padding: 8px 10px;
      width: 200px;
      border: solid 1px var(--iframe-border);
      border-radius: 6px;
      color: var(--iframe-text);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      cursor: move;
      background: var(--iframe-surface);
      font-size: 14px;
    }
  `,
})
export class BaseContentComponent {
  targetList = model<{ id: string; title: string }[]>([]);
  drop(event: IDropEvent) {
    console.log(event);
    if (event.previousContainer !== event.container) {
      const newItem = {
        id: this.generateId(),
        title: event.previousContainer.data[event.previousIndex],
      };
      event.container.data.splice(event.currentIndex, 0, newItem);
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
  onClick(item: { id: string; title: string }) {
    console.log('Clicked item:', item);
  }
}
