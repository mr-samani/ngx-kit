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

export interface BaseOverlayOptions {
  anchor: HTMLElement;
  /** pointer for context menu */
  point?: Point;
  placement?: Placement;
  alignment?: Alignment;
  margin?: number;
  onClosed?: () => void;
}

export interface OverlayOptions<T> extends BaseOverlayOptions {
  component: Type<T>;
  viewContainerRef: ViewContainerRef;
  configure?: (instance: T, ref: OverlayRef<T>) => void;
}

export interface TemplateOptions extends BaseOverlayOptions {
  template: TemplateRef<any>;
  appRef: ApplicationRef;
}
