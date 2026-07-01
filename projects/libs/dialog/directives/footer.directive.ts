import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { DIALOG_REF } from '../dialog.tokens';

@Directive({
  standalone: false,
  selector: 'ngx-dialog-footer,[ngxDialogFooter]',
  host: {
    class: 'dialog-footer',
    '[class.align-start]': 'align==="start"',
    '[class.align-end]': 'align==="end"',
    '[class.align-space-between]': 'align==="space-between"',
    '[class.align-center]': 'align==="center"',
    '[class.align-space-around]': 'align==="space-around"',
  },
  exportAs: 'ngxDialogFooter',
})
export class NgxDialogFooterDirective implements OnInit {
  @Input() align: 'start' | 'end' | 'space-between' | 'center' | 'space-around' = 'end';

  private _dialogRef = inject(DIALOG_REF);
  constructor(public _el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this._dialogRef.footer = this._el;
  }
}
