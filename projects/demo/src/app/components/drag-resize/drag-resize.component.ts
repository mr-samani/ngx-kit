import { Component } from '@angular/core';
import {
  IPosition,
  IResizableOutput,
  NgxDraggable,
  NgxResizable,
} from 'ngx-kit/drag-resize';

@Component({
  selector: 'app-drag-resize',
  imports: [NgxDraggable, NgxResizable],
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
