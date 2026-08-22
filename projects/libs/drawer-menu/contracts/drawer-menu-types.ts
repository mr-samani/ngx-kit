/** Logical drawer placement. `start` is right in RTL and left in LTR. */
export type NgxDrawerSide = 'start' | 'end';

/** How the drawer interacts with the application content. */
export type NgxDrawerMode = 'overlay' | 'push' | 'reveal';

/** Visual physics used by the drawer while opening/closing. */
export type NgxDrawerEffect = 'slide' | 'spring' | 'fabric' | 'curtain' | 'elastic' | 'reveal';

/** Controls whether viewport changes own the open state. */
export type NgxDrawerResponsiveMode = 'off' | 'auto';

/** What happens when the drawer reaches a responsive breakpoint. */
export interface NgxDrawerResponsiveConfig {
  /** Enable automatic viewport-driven state changes. */
  mode?: NgxDrawerResponsiveMode;
  /** Below this width the mobile state is used. */
  breakpoint?: number;
  /** Default state on desktop. */
  desktopOpen?: boolean;
  /** Default state on mobile/tablet. */
  mobileOpen?: boolean;
  /** Do not let responsive rules close a manually pinned drawer. */
  respectPinned?: boolean;
}
