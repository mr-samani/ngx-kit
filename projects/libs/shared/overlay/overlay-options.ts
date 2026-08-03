import { ApplicationRef, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { OverlayRef } from './overlay-ref';

/**
 * pointer position
 */
export interface Point {
  x: number;
  y: number;
}

export type Placement = 'top' | 'bottom' | 'auto';
export type Alignment = 'start' | 'center' | 'end';

export interface BaseOverlayOptions<T> {
  anchor: HTMLElement;
  /** pointer for context menu */
  point?: Point;
  placement?: Placement;
  alignment?: Alignment;
  margin?: number;
  configure?: (instance: T, ref: OverlayRef<T>) => void;
  onClosed?: () => void;
}

export interface OverlayOptions<T> extends BaseOverlayOptions<T> {
  component: Type<T>;
  viewContainerRef: ViewContainerRef;
}

export interface TemplateOptions extends BaseOverlayOptions<any> {
  template: TemplateRef<any>;
  appRef: ApplicationRef;
}
