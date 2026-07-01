import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, Inject, Input, OnInit } from '@angular/core';
import { DIALOG_REF } from '../dialog.tokens';

@Directive({
  standalone: false,
  selector: 'ngx-dialog-header,[ngxDialogHeader]',
  host: {
    class: 'dialog-header',
  },
  exportAs: 'ngxDialogHeader',
})
export class NgxDialogHeaderDirective implements OnInit {
  @Input() showCloseButton = true;

  private _dialogRef = inject(DIALOG_REF);
  constructor(
    public _el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this._el.nativeElement.innerHTML = '<span>' + this._el.nativeElement.innerHTML + '</span>';
    if (this.showCloseButton) {
      let closeBtn = this._document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML =
        '<svg width="20" height="20" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z"/></svg>';

      closeBtn.onclick = closeBtn.ontouchend = () => {
        this._dialogRef.close();
      };
      this._el.nativeElement.appendChild(closeBtn);
    }
    this._dialogRef.header = this._el;
  }
}
