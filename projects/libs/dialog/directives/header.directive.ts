import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { DIALOG_REF, NGX_DIALOG_CONFIG } from '../tokens/dialog.tokens';
import { NgxDraggable } from 'ngx-kit/drag-resize';
import { DIALOG_OVERLAY_CLASSNAME } from 'ngx-kit/core';

const CLOSE_ICON_SVG = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 320 512" aria-hidden="true">
  <path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z"/>
  </svg>`;
const MAXIMIZE_ICON_SVG = `<svg name="maximize" stroke="currentColor"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.4852 16.5149C6.9104 15.9401 7.00595 13.4982 7.00595 13.4982M7.4852 16.5149C8.06001 17.0897 10.5019 16.994 10.5019 16.994M7.4852 16.5149L11 13M16.5149 7.48512C15.9401 6.91031 13.4982 7.00596 13.4982 7.00596M16.5149 7.48512C17.0897 8.05993 16.994 10.5018 16.994 10.5018M16.5149 7.48512L13 11"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"  stroke-width="1.5"/>
</svg>`;
const RESTORE_ICON_SVG = `<svg name="restore" stroke="currentColor"   width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"  stroke-width="1.5"/>
<path d="M12.9833 11.0167C12.4085 10.4419 12.5041 8 12.5041 8M12.9833 11.0167C13.5581 11.5915 16 11.4958 16 11.4958M12.9833 11.0167L17 7M11.0131 12.9868C10.4383 12.412 7.99641 12.5077 7.99641 12.5077M11.0131 12.9868C11.5879 13.5616 11.4922 16.0035 11.4922 16.0035M11.0131 12.9868L7 16.9999"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

@Directive({
  selector: 'ngx-dialog-header,[ngxDialogHeader]',
  standalone: true,
  hostDirectives: [NgxDraggable],
  host: { class: 'dialog-header' },
  exportAs: 'ngxDialogHeader',
})
export class NgxDialogHeader implements OnInit {
  private config = inject(NGX_DIALOG_CONFIG);
  readonly showCloseButton = input(this.config.header?.showCloseButton ?? true);
  readonly showMaximizeButton = input(this.config.header?.showMaximizeButton ?? true);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly dialogRef = inject(DIALOG_REF);

  private readonly drag = inject(NgxDraggable);

  private isMaximized = false;

  ngOnInit(): void {
    this.drag.dragRootElement.set('.ngx-ui-overlay');
    this.drag.dragHandle.set('.dialog-header-title');
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
    if (this.showMaximizeButton()) {
      const fullScreenBtn = this.document.createElement('button');
      fullScreenBtn.type = 'button';
      fullScreenBtn.className = 'ngx-dialog-action-btn';
      fullScreenBtn.setAttribute('aria-label', 'Maximaize');
      fullScreenBtn.setAttribute('title', 'Maximaize');
      fullScreenBtn.innerHTML = MAXIMIZE_ICON_SVG;
      fullScreenBtn.addEventListener('click', (ev: Event) => this.fullScreen(ev));
      this.el.nativeElement.appendChild(fullScreenBtn);
    }
    if (this.showCloseButton()) {
      const closeBtn = this.document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'ngx-dialog-action-btn';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.setAttribute('title', 'Close');
      closeBtn.innerHTML = CLOSE_ICON_SVG;
      closeBtn.addEventListener('click', () => this.dialogRef.close());
      this.el.nativeElement.appendChild(closeBtn);
    }

    this.dialogRef._setHeaderElement(this.el.nativeElement);
  }

  private fullScreen(ev: Event) {
    const overlay = this.el.nativeElement.closest(`.${DIALOG_OVERLAY_CLASSNAME}`);
    this.isMaximized = !this.isMaximized;
    this.drag.disabled.set(this.isMaximized);
    if (overlay) {
      overlay.classList.toggle('ngx-dialog-fullscreen');
      const btn = ev.currentTarget as HTMLButtonElement;
      btn.innerHTML = this.isMaximized ? RESTORE_ICON_SVG : MAXIMIZE_ICON_SVG;
      btn.setAttribute('aria-label', this.isMaximized ? 'Restore' : 'Maximaize');
      btn.setAttribute('title', this.isMaximized ? 'Restore' : 'Maximaize');
    }
  }
}
