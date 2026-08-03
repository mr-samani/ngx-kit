import { InjectionToken } from '@angular/core';
import { NgxNotifyOptions } from './notify-options';
import { NgxNotifyService } from '../services/notify.service';

export const NGX_NOTIFY_CONFIG = new InjectionToken<NgxNotifyOptions>('NgxNotifyOption');
export const NGX_NOTIFY_API = new InjectionToken<NgxNotifyService>('NgxNotifyService');

export const NGX_NOTIFY_DEFAULTS: Required<NgxNotifyOptions> = {
  timeout: 3000,
  position: 'top-center',
  maxVisible: 10,
  allowHtml: false,
  pauseOnHover: true,
  dismissible: true,
  closeOnTap: true,
  containerClass: 'ngx-bg-notify',
  notificationClass: 'ngx-notify',
};
