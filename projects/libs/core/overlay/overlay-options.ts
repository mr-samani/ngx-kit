import { ApplicationRef, Injector, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { OverlayRef } from './overlay-ref';

/**
 * pointer position
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * instead of being placed above/below a (possibly absent) anchor.
 */
export type Placement = 'top' | 'bottom' | 'center' | 'auto';
export type Alignment = 'start' | 'center' | 'end';

export interface BaseOverlayOptions<T = any> {
  /**
   * Element the overlay is positioned 
   */
  anchor?: HTMLElement;
  /** pointer for context menu */
  point?: Point;
  placement?: Placement;
  alignment?: Alignment;
  margin?: number;

  /**
   * Whether to render this overlay using the native Popover API (top-layer
   * rendering, escapes clipping/stacking-context issues of ancestors).
   * Falls back automatically to a manual z-index based overlay when the
   * browser doesn't support the Popover API. Defaults to `true`.
   */
  usePopover?: boolean;

  /**
   * Parent injector used when creating the overlay's component. Lets callers
   * (e.g. a dialog service) provide their own tokens - such as data or a
   * reference back to the overlay - to the created component and everything
   * it projects. Defaults to the injector of `viewContainerRef` (or, when
   * `viewContainerRef` is omitted, the root environment injector).
   */
  injector?: Injector;

  /** Close this overlay when Escape is pressed while it's the topmost overlay. Default: true. */
  closeOnEscape?: boolean;
  /** Close this overlay on a click outside its panel and anchor. Default: true. */
  closeOnOutsideClick?: boolean;
  /**
   * Synchronous guard consulted before Escape/outside-click would close the
   * overlay. Return `false` to block the dismissal (e.g. "unsaved changes").
   * Does NOT affect programmatic `close()` calls.
   */
  canClose?: () => boolean;

  /** Move focus into the overlay when it opens. Default: true. */
  autoFocus?: boolean;
  /** Restore focus to the previously focused element when the overlay closes. Default: true. */
  restoreFocus?: boolean;

  /** Prevent the page behind the overlay from scrolling while it's open. Default: false. */
  lockBodyScroll?: boolean;

  /** Extra class(es) applied to the backdrop element. */
  backdropClass?: string | string[];
  /** Extra class(es) applied to the overlay panel element. */
  panelClass?: string | string[];

  /** `role` attribute for the overlay panel. Default: 'dialog'. */
  role?: string;
  /** Whether to set `aria-modal="true"` on the overlay panel. Default: true. */
  ariaModal?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;

  configure?: (instance: T, ref: OverlayRef<T>) => void;
  onClosed?: () => void;
}

export interface OverlayOptions<T> extends BaseOverlayOptions<T> {
  component: Type<T>;
  /**
   * Optional. When provided, the component is created through this
   * ViewContainerRef (inheriting its injector/change-detection context by
   * default - override with `injector`). When omitted, the component is
   * created and attached directly to the ApplicationRef, which is what lets
   * services with no template context (e.g. a global dialog service) open
   * overlays without needing a host ViewContainerRef.
   */
  viewContainerRef?: ViewContainerRef;
}

export interface TemplateOptions extends BaseOverlayOptions<any> {
  template: TemplateRef<any>;
  /** Falls back to the ApplicationRef injected internally by OverlayService when omitted. */
  appRef?: ApplicationRef;
}
