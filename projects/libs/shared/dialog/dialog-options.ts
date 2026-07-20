import { ApplicationRef, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { OverlayRef } from './dialog-overlay-ref';

export interface DialogOptions<T> {
  anchor: HTMLElement;
  component: Type<T>;
  viewContainerRef: ViewContainerRef;

  configure?: (instance: T, ref: OverlayRef<T>) => void;

  /**
   * @default : 8
   */
  margin?: number;

  /**
   * @default 'auto'
   */
  placement?: 'auto' | 'top' | 'bottom'; // default: auto

  /**
   * @default 'center'
   */
  alignment?: 'start' | 'center' | 'end'; // default: center

  /**
   * @default true
   */
  closeOnBackdropClick?: boolean; // default: true

  onClosed?: () => void;
}

export interface TemplateOptions {
  anchor: HTMLElement;
  template: TemplateRef<any>;
  appRef: ApplicationRef;
  /**
   * @default : 8
   */
  margin?: number;

  /**
   * @default 'auto'
   */
  placement?: 'auto' | 'top' | 'bottom'; // default: auto

  /**
   * @default 'center'
   */
  alignment?: 'start' | 'center' | 'end'; // default: center

  /**
   * @default true
   */
  closeOnBackdropClick?: boolean; // default: true

  onClosed?: () => void;
}
