import { Component } from '@angular/core';
import {
  IPosition,
  IResizableOutput,
  NgxDraggableDirective,
  NgxResizableDirective,
} from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-drag-resize',
  imports: [NgxDraggableDirective, NgxResizableDirective],
  templateUrl: './drag-resize.component.html',
  styleUrl: './drag-resize.component.scss',
})
export class DragResizeComponent {
  onDragEnd(event: IPosition) {
    console.log('dragEnd', event);
  }
  onResizeEnd(event: IResizableOutput) {
    console.log('resizeEnd', event);
  }
}
