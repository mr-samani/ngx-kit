import { Observable } from 'rxjs';
import { NgxNotifyOptions } from './notify-options';
import { EventEmitter } from '@angular/core';

export type NgxNotifyType = 'success' | 'error' | 'warning' | 'info';
export type NgxNotifyPositionType =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';
export interface NgxNotifyPayload {
  id: string;
  message: string;
  description?: string;
  type: NgxNotifyType;
  options: NgxNotifyOptions;

  onClose: EventEmitter<INotifyEnd>;
  onFinish: EventEmitter<INotifyEnd>;
}

export interface INotifyEnd {
  id: string;
  el: HTMLElement;
}
