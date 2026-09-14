import { DestroyRef, Directive, ElementRef, Renderer2, effect, inject } from '@angular/core';
import { DIALOG_REF } from '../tokens/dialog.tokens';

/**
 * Why this can't be pure CSS flexbox: the header/body/footer elements are
 * *grandchildren* of the dialog panel (panel -> `*ngComponentOutlet`'s host
 * element -> header/body/footer), not direct children, because the content
 * component that hosts them is arbitrary and we don't control its own host
 * styling. `display:flex;flex-direction:column` on the panel therefore can't
 * size the body against the header/footer through that extra layer, so we
 * measure and set an explicit `max-height` instead, driven by a
 * `ResizeObserver` on the panel (not a `window:resize` listener, so it also
 * reacts to the dialog itself changing size, e.g. via `config.size`).
 */
@Directive({
  selector: 'ngx-dialog-body,[ngxDialogBody]',
  standalone: true,
  host: { class: 'dialog-body' },
  exportAs: 'ngxDialogBody',
})
export class NgxDialogBody {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly dialogRef = inject(DIALOG_REF);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.dialogRef._setBodyElement(this.el.nativeElement);
    this.destroyRef.onDestroy(() => this.dialogRef._setBodyElement(null));

    effect((onCleanup) => {
      const panel = this.dialogRef.panelEl();
      if (!panel || typeof ResizeObserver === 'undefined') {
        return;
      }
      const recompute = (): void => this.recomputeHeight(panel);
      const observer = new ResizeObserver(recompute);
      observer.observe(panel);
      recompute();
      onCleanup(() => observer.disconnect());
    });
  }

  private recomputeHeight(panel: HTMLElement): void {
    const headerHeight = this.dialogRef.headerEl()?.offsetHeight ?? 0;
    const footerHeight = this.dialogRef.footerEl()?.offsetHeight ?? 0;
    const available = panel.clientHeight - headerHeight - footerHeight;
    if (available > 0) {
      this.renderer.setStyle(this.el.nativeElement, 'max-height', `${available}px`);
    }
  }
}