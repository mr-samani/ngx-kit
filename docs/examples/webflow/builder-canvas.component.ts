import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DraggableDirective,
  ResizableDirective,
  DropzoneContainerDirective,
  FlowDropIndicatorComponent,
  FlowTreeService,
  type DragEndEvent,
  type ResizeMoveEvent,
} from 'ngx-kit/webflow';

/**
 * نمونهٔ استفاده — نشان می‌دهد چطور دو دایرکتیو + سرویس مدل درختی
 * با هم یک صفحه‌سازِ Webflow-مانند می‌سازند. با هزاران بلاک هم
 * (children.length زیاد) روان می‌ماند چون:
 *  - در حین درگ فقط یک خط اندیکاتور آپدیت می‌شود.
 *  - trackBy با id باعث می‌شود Angular فقط نودهای واقعاً تغییرکرده
 *    را دوباره render کند.
 */
@Component({
  selector: 'flow-builder-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DraggableDirective,
    ResizableDirective,
    DropzoneContainerDirective,
    FlowDropIndicatorComponent,
  ],
  template: `
    <div class="flow-canvas" ngxDropzoneContainer ngxDropzoneAxis="column">
      @for (block of tree.root().children; track block.id) {
        <div
          class="flow-block"
          [attr.data-flow-id]="block.id"
          [attr.data-flow-container]="block.isContainer ? '' : null"
          ngxDraggable
          [ngxDraggableId]="block.id"
          ngxResizable
          [ngxResizableId]="block.id"
          (flowDragEnd)="onDragEnd($event)"
          (flowResizeMove)="onResizeMove($event)">
          <div class="flow-block__handle" ngxDragHandleSelector>⠿</div>
          <div class="flow-block__label">{{ block.type }} — {{ block.id }}</div>

          <span class="rz-handle" data-handle="se"></span>
          <span class="rz-handle" data-handle="e"></span>
          <span class="rz-handle" data-handle="s"></span>
        </div>
      }
    </div>

    <flow-drop-indicator />
    <div class="mm" ngxDraggable [ngxDraggableId]="'d1'"></div>
  `,
  styles: [
    `
    .mm{
      background: red;
      width:230px;
      height: 230px;
    }
      .flow-canvas {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 400px;
        padding: 16px;
        background: #fafafa;
        border: 1px dashed #ccc;
      }
      .flow-block {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 6px;
        cursor: default;
        user-select: none;
      }
      .flow-block.ngx-drag-ghost {
        opacity: 0.5;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 100;
      }
      .flow-block__handle {
        cursor: grab;
        opacity: 0.5;
      }
      .rz-handle {
        position: absolute;
        background: #146ef5;
        border-radius: 2px;
      }
      .rz-handle[data-handle='se'] {
        width: 10px;
        height: 10px;
        right: -5px;
        bottom: -5px;
        cursor: se-resize;
      }
      .rz-handle[data-handle='e'] {
        width: 6px;
        height: 40%;
        right: -3px;
        top: 30%;
        cursor: e-resize;
      }
      .rz-handle[data-handle='s'] {
        height: 6px;
        width: 40%;
        bottom: -3px;
        left: 30%;
        cursor: s-resize;
      }
    `,
  ],
})
export class BuilderCanvasComponent implements OnInit{
  readonly tree = inject(FlowTreeService);


  ngOnInit(): void {
    this.tree.root().children.push({
      id:'123',
      isContainer:true,
      type:'dd',
      axis:'column',
      children:[]
    })
  }
  onDragEnd(e: DragEndEvent): void {
    if (e.drop) {
      // تنها لحظه‌ای که مدل واقعاً تغییر می‌کند — نه در حین حرکت ماوس.
      this.tree.applyDrop(e.id, e.drop);
    }
  }

  onResizeMove(e: ResizeMoveEvent): void {
    // در پروژهٔ واقعی: اینجا width/height را روی props همان نود در
    // FlowTreeService ست کن (با همان الگوی immutable-update).
  }
}
