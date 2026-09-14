import { ApplicationRef, TemplateRef, Type, ViewContainerRef, type Injector } from '@angular/core';
import { OverlayRef } from './overlay-ref';

/**
 * pointer position
 */
export interface Point {
  x: number;
  y: number;
}

export type Placement = 'top' | 'bottom' | 'auto' | 'center';
export type Alignment = 'start' | 'center' | 'end';

export interface BaseOverlayOptions<T = any> {
  anchor?: HTMLElement;
  /** pointer for context menu */
  point?: Point;
  placement?: Placement;
  alignment?: Alignment;
  margin?: number;
  backdropClass?: string | string[];
  /**
   * Whether to render this overlay using the native Popover API (top-layer
   * rendering, escapes clipping/stacking-context issues of ancestors).
   * Falls back automatically to a manual z-index based overlay when the
   * browser doesn't support the Popover API. Defaults to `true`.
   */
  usePopover?: boolean;

  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  canClose?: () => boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  lockBodyScroll?: boolean;
  configure?: (instance: T, ref: OverlayRef<T>) => void;
  onClosed?: () => void;

  panelClass?: string | string[];
  role?: string;
  ariaModal?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  injector?: Injector;
}

export interface OverlayOptions<T> extends BaseOverlayOptions<T> {
  component: Type<T>;
  viewContainerRef?: ViewContainerRef;
}

export interface TemplateOptions extends BaseOverlayOptions<any> {
  template: TemplateRef<any>;
  appRef: ApplicationRef;
}
