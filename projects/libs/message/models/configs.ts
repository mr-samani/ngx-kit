import { Inject, InjectionToken } from '@angular/core';
import { IMessageOptions } from './message-options.interface';
import { NgxMessageService } from '../public-api';
import { MessageOptions } from './message-options';

export type MessageIcon =
  'None' | 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';

export const NGX_MESSAGE_CONFIGS = new InjectionToken<IMessageOptions>('ngx-message-configs');

export const NGX_MESSAGE_API = new InjectionToken<NgxMessageService>('NgxMessageService');
export const NGX_MESSAGE_DEFAULT_OPTIONS: MessageOptions = {
  useOverlay: true,
  title: '',
  text: '',
  html: '',
  backdrop: true,
  icon: 'None',
  width: undefined,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  showConfirmButton: true,
  showDenyButton: false,
  showCancelButton: false,
  confirmButtonText: 'Ok',
  denyButtonText: 'No',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '',
  denyButtonColor: '',
  cancelButtonColor: '',
  confirmButtonAriaLabel: '',
  denyButtonAriaLabel: '',
  cancelButtonAriaLabel: '',
  reverseButtons: false,
  showCloseButton: true,
  containerClass: '',
};
