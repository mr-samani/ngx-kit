import { Injectable, Injector, Type, computed, inject, signal } from '@angular/core';
import { OverlayService, OverlayOptions } from 'ngx-kit/core';
import { NgxDialogRef } from '../configs/dialog-ref';
import { NgxDialogConfig } from '../configs/dialog-config';
import {
  NGX_DIALOG_CONFIG,
  DIALOG_CONTENT,
  DIALOG_DATA,
  DIALOG_REF,
} from '../tokens/dialog.tokens';
import { NgxDialogComponent } from '../components/ngx-dialog.component';

@Injectable({ providedIn: 'root' })
export class NgxDialogService {
  private readonly overlay = inject(OverlayService);
  private readonly injector = inject(Injector);

  private readonly _openRefs = signal<NgxDialogRef<any>[]>([]);
  /** Every currently open dialog, oldest first. */
  readonly openDialogs = this._openRefs.asReadonly();
  /** How many dialogs are currently open. */
  readonly openCount = computed(() => this._openRefs().length);
  readonly defaultConfig = inject(NGX_DIALOG_CONFIG);
  /**
   * Opens `content` inside a dialog panel and returns a ref you can use to
   * close it and read the result back (`afterClosed`).
   */
  open<R = any, DataType = any>(
    content: Type<any>,
    config?: Partial<NgxDialogConfig<DataType>>,
  ): NgxDialogRef<R> {
    const resolvedConfig = { ...this.defaultConfig, ...config };
    const dialogRef = new NgxDialogRef<R>();
    dialogRef.beforeClose = resolvedConfig.beforeClose;

    const componentInjector = Injector.create({
      providers: [
        { provide: DIALOG_DATA, useValue: resolvedConfig.data },
        { provide: DIALOG_REF, useValue: dialogRef },
        { provide: NGX_DIALOG_CONFIG, useValue: resolvedConfig },
        { provide: DIALOG_CONTENT, useValue: content },
      ],
      parent: resolvedConfig.injector ?? this.injector,
    });

    const disableClose = resolvedConfig.disableClose ?? false;

    const overlayRef = this.overlay.open<NgxDialogComponent>({
      component: NgxDialogComponent,
      injector: componentInjector,
      placement: 'center',
      alignment: 'center',
      margin: 0,
      role: resolvedConfig.role ?? 'dialog',
      ariaModal: true,
      ariaLabel: resolvedConfig.ariaLabel,
      ariaLabelledby: resolvedConfig.ariaLabelledby,
      ariaDescribedby: resolvedConfig.ariaDescribedby,
      usePopover: resolvedConfig.usePopover ?? true,
      closeOnEscape: disableClose ? false : (resolvedConfig.closeOnEscape ?? true),
      closeOnOutsideClick: disableClose ? false : (resolvedConfig.closeOnOutsideClick ?? false),
      canClose: () => dialogRef.beforeClose?.() ?? true,
      restoreFocus: resolvedConfig.restoreFocus ?? true,
      autoFocus: resolvedConfig.autoFocus ?? true,
      lockBodyScroll: resolvedConfig.lockBodyScroll ?? true,
      backdropClass: resolvedConfig.backdropClass,
      panelClass: resolvedConfig.panelClass,
      configure: (_instance, ref) => this.applySizing(ref.nativeElement, resolvedConfig),
      onClosed: () => {
        this._openRefs.update((refs) => refs.filter((r) => r !== dialogRef));
        dialogRef._finalizeClose();
      },
    } satisfies OverlayOptions<NgxDialogComponent>);

    dialogRef._attachOverlayRef(overlayRef);
    this._openRefs.update((refs) => [...refs, dialogRef]);
    return dialogRef;
  }

  /** Closes every currently open dialog (ignores `disableClose`/guards - use sparingly, e.g. on logout). */
  closeAll(): void {
    [...this._openRefs()].forEach((ref) => ref.close());
  }

  private applySizing(el: HTMLElement | null, config: NgxDialogConfig): void {
    if (!el) return;
    if (config.width) el.style.width = config.width;
    if (config.minWidth) el.style.minWidth = config.minWidth;
    if (config.maxWidth) el.style.maxWidth = config.maxWidth;
    if (config.height) el.style.height = config.height;
    if (config.minHeight) el.style.minHeight = config.minHeight;
    if (config.maxHeight) el.style.maxHeight = config.maxHeight;
  }
}
