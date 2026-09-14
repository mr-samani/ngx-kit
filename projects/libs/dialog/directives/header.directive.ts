import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { DIALOG_REF } from '../tokens/dialog.tokens';

const CLOSE_ICON_SVG =
  '<svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true">' +
  '<path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z"/>' +
  '</svg>';

@Directive({
  selector: 'ngx-dialog-header,[ngxDialogHeader]',
  standalone: true,
  host: { class: 'dialog-header' },
  exportAs: 'ngxDialogHeader',
})
export class NgxDialogHeader implements OnInit {
  readonly showCloseButton = input(true);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly dialogRef = inject(DIALOG_REF);

  ngOnInit(): void {
    // Wrap the existing (Angular-rendered) header content in a title span by
    // MOVING the actual DOM nodes, not by re-serializing/re-parsing
    // `innerHTML`. The original implementation did
    // `el.innerHTML = '<span>' + el.innerHTML + '</span>'`, which silently
    // destroys any event listeners or component state living inside the
    // header content (anything beyond static text) because the browser
    // throws away and re-parses the whole subtree.
    const titleWrapper = this.document.createElement('span');
    titleWrapper.className = 'dialog-header-title';
    while (this.el.nativeElement.firstChild) {
      titleWrapper.appendChild(this.el.nativeElement.firstChild);
    }
    this.el.nativeElement.appendChild(titleWrapper);

    if (this.showCloseButton()) {
      const closeBtn = this.document.createElement('button');
      // Missing `type="button"` in the original meant this button defaulted
      // to type="submit" inside any <form>, which could unexpectedly submit
      // a form living in the dialog's content when clicked.
      closeBtn.type = 'button';
      closeBtn.className = 'close-btn';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = CLOSE_ICON_SVG;
      // A single 'click' listener is enough - browsers already synthesize a
      // click from touch taps. The original also bound `ontouchend`, which
      // fired an extra close on touch devices (double-close race).
      closeBtn.addEventListener('click', () => this.dialogRef.close());
      this.el.nativeElement.appendChild(closeBtn);
    }

    this.dialogRef._setHeaderElement(this.el.nativeElement);
  }
}
