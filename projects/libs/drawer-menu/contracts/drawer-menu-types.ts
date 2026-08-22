/** Logical drawer placement. `start` is right in RTL and left in LTR. */
export type NgxDrawerSide = 'start' | 'end';

/** How the drawer interacts with the application content. */
export type NgxDrawerMode = 'overlay' | 'push' | 'reveal';

/** Desktop/mobile layout behavior when responsive mode is enabled. */
export type NgxDrawerResponsiveBehavior = 'overlay' | 'dock';

/** Visual physics used by the drawer while opening/closing. */
export type NgxDrawerEffect = 'slide' | 'spring' | 'fabric' | 'curtain' | 'elastic' | 'reveal';

export type NgxDrawerResponsiveMode = 'off' | 'auto';

export interface NgxDrawerResponsiveConfig {
  mode?: NgxDrawerResponsiveMode;
  breakpoint?: number;
  desktopOpen?: boolean;
  mobileOpen?: boolean;
  /** Desktop layout: dock means a real sidebar; overlay means floating drawer. */
  desktopBehavior?: NgxDrawerResponsiveBehavior;
  /** Mobile layout is normally overlay. */
  mobileBehavior?: NgxDrawerResponsiveBehavior;
  respectPinned?: boolean;
}
