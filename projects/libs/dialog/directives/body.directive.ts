import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { DIALOG_REF } from '../tokens/dialog.tokens';

@Directive({
  selector: 'ngx-dialog-body,[ngxDialogBody]',
  standalone: true,
  host: { class: 'dialog-body' },
  exportAs: 'ngxDialogBody',
})
export class NgxDialogBody {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly dialogRef = inject(DIALOG_REF);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.dialogRef._setBodyElement(this.el.nativeElement);
    this.destroyRef.onDestroy(() => this.dialogRef._setBodyElement(null));
    this.el.nativeElement.parentElement?.classList.add('ngx-dialog-inner');
  }
}
