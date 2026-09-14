import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { DIALOG_REF } from '../dialog.tokens';

export type NgxDialogFooterAlign = 'start' | 'end' | 'center' | 'space-between' | 'space-around';

@Directive({
  selector: 'ngx-dialog-footer,[ngxDialogFooter]',
  standalone: true,
  host: {
    class: 'dialog-footer',
    '[class.align-start]': 'align() === "start"',
    '[class.align-end]': 'align() === "end"',
    '[class.align-space-between]': 'align() === "space-between"',
    '[class.align-center]': 'align() === "center"',
    '[class.align-space-around]': 'align() === "space-around"',
  },
  exportAs: 'ngxDialogFooter',
})
export class NgxDialogFooterDirective implements OnInit, OnDestroy {
  readonly align = input<NgxDialogFooterAlign>('end');

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly dialogRef = inject(DIALOG_REF);

  ngOnInit(): void {
    this.dialogRef._setFooterElement(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.dialogRef._setFooterElement(null);
  }
}
