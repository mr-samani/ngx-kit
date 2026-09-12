/** Logical drawer placement. `start` is right in RTL and left in LTR. */
export type NgxDrawerSide = 'start' | 'end';

/** Visual physics used by the drawer while opening/closing. */
export type NgxDrawerEffect =
  | 'none'
  | 'fabric'
  | 'slide'
  | 'push'
  | 'scale';

export type NgxDrawerBehavior =
  | 'dock'
  | 'overlay';

export type NgxDrawerResponsiveMode =
  | 'auto'
  | 'desktop'
  | 'mobile';

export interface NgxDrawerResponsive {
  /**
   * auto:
   *   breakpoint determines desktop/mobile mode
   *
   * desktop:
   *   always desktop
   *
   * mobile:
   *   always mobile
   */
  mode?: NgxDrawerResponsiveMode;

  /**
   * Width at which the drawer switches
   * between desktop and mobile.
   */
  breakpoint?: number;

  /**
   * Initial/default state on desktop.
   */
  desktopOpen?: boolean;

  /**
   * Initial/default state on mobile.
   */
  mobileOpen?: boolean;

  /**
   * Desktop drawer behavior.
   */
  desktopBehavior?: NgxDrawerBehavior;

  /**
   * Mobile drawer behavior.
   */
  mobileBehavior?: NgxDrawerBehavior;

  /**
   * If true, pinned state is preserved
   * when switching between desktop/mobile.
   */
  respectPinned?: boolean;
}

export const DEFAULT_DRAWER_RESPONSIVE: Required<NgxDrawerResponsive> = {
  mode: 'auto',
  breakpoint: 960,
  desktopOpen: true,
  mobileOpen: false,
  desktopBehavior: 'dock',
  mobileBehavior: 'overlay',
  respectPinned: true,
};