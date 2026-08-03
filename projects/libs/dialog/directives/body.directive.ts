import { AfterViewInit, Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { DIALOG_REF } from '../dialog.tokens';

@Directive({
  standalone: false,
  selector: 'ngx-dialog-body,[ngxDialogBody]',
  host: {
    class: 'dialog-body',
  },
  exportAs: 'ngxDialogBody',
})
export class NgxDialogBodyDirective implements AfterViewInit {
  height?: number;

  private _dialogRef = inject(DIALOG_REF);
  constructor(
    public _el: ElementRef<HTMLElement>,
    private _renderer: Renderer2,
  ) {
    this._dialogRef.body = this._el;
  }

  ngAfterViewInit(): void {
    this.onWindowResize();
    if (this._dialogRef.dialog && this._dialogRef.dialog.nativeElement) {
      new ResizeObserver(() => {
        this.onWindowResize();
      }).observe(this._dialogRef.dialog.nativeElement);
    }
  }

  // @HostListener('window:resize', ['$event'])
  onWindowResize(ev?: Event) {
    if (!window) return;
    let headerH = 0;
    let footerH = 0;
    let dialogH = window.innerHeight;
    if (this._dialogRef.header) {
      headerH = this._dialogRef.header.nativeElement.offsetHeight;
    }
    if (this._dialogRef.footer) {
      footerH = this._dialogRef.footer.nativeElement.offsetHeight;
    }
    if (this._dialogRef.dialog && this._dialogRef.dialog.nativeElement.offsetHeight < dialogH) {
      dialogH = this._dialogRef.dialog.nativeElement.offsetHeight;
    }
    this.height = dialogH - headerH - footerH;
    this._renderer.setStyle(this._el.nativeElement, 'max-height', this.height + 'px');
    // console.log(this.height, ':', 'windowHeight', dialogH, 'h', headerH, 'f', footerH);
  }
}
