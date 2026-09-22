import { Injector } from '@angular/core';
import { NgxDialogFooterAlign } from '../directives/footer.directive';

export type NgxDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface NgxDialogHeaderConfig {
  enable?: boolean;
  title?: string;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
}

export interface NgxDialogFooterConfig {
  enable?: boolean;
  /** Text for the auto-generated close button. Default: 'Close'. */
  closeText?: string;
  align?: NgxDialogFooterAlign;
}

/**
 * BREAKING CHANGE from the previous version of this config:
 * - `allowCloseOnOutsideClick` -> `closeOnOutsideClick` (naming now matches
 *   `ngx-kit/overlay`'s options, which this service is built directly on).
 * - `header`/`footer` are now actually wired up (previously declared but
 *   unused) - set `enable: true` to get an automatic header/footer without
 *   having to place the `ngxDialogHeader`/`ngxDialogFooter` directives
 *   yourself inside the content component.
 */
export class NgxDialogConfig<DataType = any> {
  /** Data made available to the content component (and to `ngx-dialog-panel`
   * itself) via the `DIALOG_DATA` injection token. */
  data?: DataType = {} as DataType;

  /** Named size preset - sets sensible min/max width bounds. Combine with
   * `width`/`maxWidth`/... for full manual control. */
  size?: NgxDialogSize = 'lg';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;

  /** Extra class(es) on the dialog panel (the `ngx-dialog-panel` host). */
  panelClass?: string | string[] = 'ngx-kit';
  /** Extra class(es) on the backdrop element behind the panel. */
  backdropClass?: string | string[] = 'ngx-dialog-backdrop';

  header?: NgxDialogHeaderConfig = {
    enable: false,
    showCloseButton: true,
    showMaximizeButton: true,
  };
  footer?: NgxDialogFooterConfig = { enable: false, align: 'end' };

  /** Close when clicking outside the panel.
   * - Default: `true`
   * */
  closeOnOutsideClick?: boolean = true;
  /** Close on Escape.
   * - Default: `true`
   *  */
  closeOnEscape?: boolean = true;
  /** Shorthand for `closeOnOutsideClick: false, closeOnEscape: false` - the
   * dialog can then only be closed programmatically (e.g. via its own
   * buttons calling `dialogRef.close()`). */
  disableClose?: boolean = false;
  /** Synchronous guard consulted before Escape/outside-click would close the
   * dialog - return `false` to block it (e.g. unsaved changes). Does not
   * affect a programmatic `dialogRef.close()` call. */
  beforeClose?: () => boolean;

  /** Prevent the page behind the dialog from scrolling while it's open. Default: true. */
  lockBodyScroll?: boolean = true;
  /** Move focus into the dialog on open. Default: true. */
  autoFocus?: boolean = true;
  /** Restore focus to the previously focused element on close. Default: true. */
  restoreFocus?: boolean = true;
  /** Render via the native Popover API when supported. Default: true. */
  usePopover?: boolean = true;

  role?: 'dialog' | 'alertdialog' = 'dialog';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;

  /** Entry animation for the panel. Default: 'zoom'. */
  animation?: 'zoom' | 'fade' | 'slide-up' | 'none' = 'zoom';

  /** Parent injector for the content component (and `ngx-dialog-panel`
   * itself). Defaults to the root injector. */
  injector?: Injector;

  constructor(init?: Partial<NgxDialogConfig<DataType>>) {
    Object.assign(this, init);
  }
}
