import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { moveItemInArray, NgxDraggable, NgxDropList, type IDropEvent } from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-drop-list',
  templateUrl: './drop-list.component.html',
  styleUrls: ['./drop-list.component.scss'],
  imports: [NgxDropList, NgxDraggable],
})
export class DropListComponent implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  selectedExample = signal('sortable');
  items: {
    title: string;
    tag: string;
  }[] = [];
  constructor() {
    this.route.fragment.subscribe((f) => {
      this.selectedExample.set(f ?? 'sortable');
    });
    this.items = [];
    for (let i = 0; i <= 8; i++) {
      this.items.push({
        title: 'report element ' + i,
        tag: ['div', 'input', 'button'][Math.floor(Math.random() * 3)],
      });
    }
  }

  ngOnInit() {}
  drop(ev: IDropEvent, list: any[]) {
    console.log('Drop event: ', ev);
    moveItemInArray(list, ev.previousIndex, ev.currentIndex);
  }
}
