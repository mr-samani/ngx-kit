import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NgxDialogConfig } from './ngx-dialog-config';
import { DIALOG_REF } from './dialog.tokens';

@Component({
  standalone: false,
  templateUrl: './ngx-dialog.component.html',
  styleUrls: ['./ngx-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  config?: NgxDialogConfig;
  component!: Type<any>;
  private readonly _onClose = new Subject<void>();
  public onClose = this._onClose.asObservable();
  @ViewChild('ngxDialog') ngxDialog?: ElementRef<HTMLElement>;

  _dialogRef = inject(DIALOG_REF);
  private cd = inject(ChangeDetectorRef);
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._dialogRef.dialog = this.ngxDialog;
    this.setStyle();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}

  onOverlayClicked(evt: MouseEvent): void {
    if (this.config?.allowCloseOnOutsideClick) {
      this._dialogRef.close();
    }
  }

  onDialogClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  close(): void {
    this._onClose.next();
  }

  setStyle() {
    if (this.ngxDialog) {
      if (this.config?.width) {
        this.ngxDialog.nativeElement.style.width = this.config.width;
      }
      if (this.config?.maxWidth) {
        this.ngxDialog.nativeElement.style.maxWidth = this.config.maxWidth;
      } else {
        this.ngxDialog.nativeElement.style.maxWidth = '100%';
      }
      if (this.config?.minWidth) {
        this.ngxDialog.nativeElement.style.minWidth = this.config.minWidth;
      }
      if (this.config?.height) {
        this.ngxDialog.nativeElement.style.height = this.config.height;
      }
      if (this.config?.maxHeight) {
        this.ngxDialog.nativeElement.style.maxHeight = this.config.maxHeight;
      } else {
        this.ngxDialog.nativeElement.style.maxHeight = '100%';
      }
      if (this.config?.minHeight) {
        this.ngxDialog.nativeElement.style.minHeight = this.config.minHeight;
      }
    }
  }
}
