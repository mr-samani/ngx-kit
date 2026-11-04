import { Directive, input, HostListener, inject } from '@angular/core';
import { LogicalResizeDirection } from '../public-api';
import { NgxResizable } from './ngx-resizable.directive';

/**
 * Typed handle API. Prefer ngxResizeHandle="se" in templates; the legacy
 * data-ngx-resize-handle attribute remains available for backwards compatibility.
 */
@Directive({
  selector: '[ngxResizeHandle]',
  standalone: true,
  host: {
    '[style.touch-action]': '"none"',
    '[style.user-select]': '"none"',
  },
})
export class NgxResizeHandle {
  readonly ngxResizeHandle = input.required<LogicalResizeDirection>();
  private readonly parent = inject(NgxResizable, { optional: true, skipSelf: true });

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.parent?.beginResize(event, this.ngxResizeHandle());
  }
}
