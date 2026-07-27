import { NgxNotifyOptions } from './notify-options';

export type NgxPgNotifyType = 'success' | 'error' | 'warning' | 'info';
export interface NgxNotifyPayload {
  id: string;
  message: string;
  description?: string;
  type: NgxPgNotifyType;
  options: NgxNotifyOptions;
}

export interface INotifyEnd {
  id: string;
  el: HTMLElement;
}
