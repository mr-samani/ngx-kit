import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject } from '@angular/core';
import { NGX_DIALOG_CONFIG, DIALOG_CONTENT, DIALOG_REF } from '../tokens/dialog.tokens';
import { NgxDialogFooter } from '../directives/footer.directive';
import { NgxDialogHeader } from '../directives/header.directive';

/**
 * The dialog "panel" shell. It no longer owns the backdrop, centering,
 * focus trap, Escape handling or outside-click handling - all of that now
 * lives in `OverlayService`, which this component is rendered inside of.
 * This is intentionally a thin, fully signal-driven shell: no
 * `AfterViewInit`, no manual `ChangeDetectorRef.detectChanges()`, no
 * imperative style writes. Angular schedules change detection automatically
 * whenever a signal read from the template changes, including in zoneless
 * apps.
 */
@Component({
  selector: 'ngx-dialog-panel',
  standalone: true,
  imports: [NgComponentOutlet, NgxDialogHeader, NgxDialogFooter],
  templateUrl: './ngx-dialog.component.html',
  styleUrl: './ngx-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-dialog-panel',
    '[class]': 'sizeClass()',
  },
})
export class NgxDialogComponent {
  protected readonly dialogRef = inject(DIALOG_REF);
  protected readonly config = inject(NGX_DIALOG_CONFIG);
  protected readonly content = inject(DIALOG_CONTENT);

  protected readonly sizeClass = computed(() =>
    this.config.size ? `ngx-dialog-size-${this.config.size}` : '',
  );

  constructor() {
    this.dialogRef._setPanelElement(inject(ElementRef<HTMLElement>).nativeElement);
  }
}
