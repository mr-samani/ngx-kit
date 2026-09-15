import { InjectionToken, Type } from '@angular/core';
import { NgxDialogConfig } from '../configs/dialog-config';
import { NgxDialogRef } from '../configs/dialog-ref';

export const DIALOG_DATA = new InjectionToken<any>('NGX_DIALOG_DATA');
export const DIALOG_REF = new InjectionToken<NgxDialogRef<any>>('NGX_DIALOG_REF');
/** The resolved config for the dialog currently being rendered. */

export const NGX_DIALOG_DEFAULT_CONFIG = new NgxDialogConfig();
export const NGX_DIALOG_CONFIG = new InjectionToken<NgxDialogConfig<any>>('NGX_NGX_DIALOG_CONFIG');
/** The arbitrary content component passed to `open()`, projected via `*ngComponentOutlet`. */
export const DIALOG_CONTENT = new InjectionToken<Type<any>>('NGX_DIALOG_CONTENT');
