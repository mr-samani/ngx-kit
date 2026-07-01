import { InjectionToken } from '@angular/core';
import { NgxDialogRef } from './ngx-dialog-ref';

export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');
export const DIALOG_REF = new InjectionToken<NgxDialogRef>('DIALOG_REF');
