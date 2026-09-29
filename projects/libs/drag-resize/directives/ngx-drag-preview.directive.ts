import { ApplicationRef, Directive, inject, InjectionToken, TemplateRef } from '@angular/core';
import { DragPreviewRef } from '../drag-preview-ref';

export const NGX_DRAG_PREVIEW = new InjectionToken<DragPreviewRef>('ngx_drag_preview');

/**
 * Custom preview content, from `*ngxDragPreview` inside the `ngxDraggable`.
 *
 * @example
 *  ```html
 *  <div ngxDropList>
 *   <div ngxDraggable>
 *     <span class="my-preview" *ngxDragPreview></span>
 *     ...
 *   </div>
 * </div>
 *  ```
 */
@Directive({
  selector: '[ngxDragPreview]',
  providers: [{ provide: NGX_DRAG_PREVIEW, useExisting: NgxDragPreview }],
})
export class NgxDragPreview {
  readonly _ref = new DragPreviewRef();

  constructor(public readonly tpl: TemplateRef<unknown>) {
    this._ref.tpl = tpl;
    this._ref.appRef = inject(ApplicationRef);
  }
}
