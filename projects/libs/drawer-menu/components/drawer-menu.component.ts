import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import {
  DEFAULT_DRAWER_RESPONSIVE,
  NgxDrawerBehavior,
  NgxDrawerEffect,
  NgxDrawerResponsive,
  NgxDrawerSide,
} from '../contracts/drawer-menu-types';

@Component({
  selector: 'ngx-drawer-menu',
  standalone: true,
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDrawerMenuComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly side = input<NgxDrawerSide>('start');

  readonly effect = input<NgxDrawerEffect>('fabric');

  readonly width = input<number | string>(300);

  /**
   * Main drawer state.
   *
   * Usage:
   *
   * [(open)]="sidebarOpen"
   */
  readonly open = model<boolean>(false);

  /**
   * Pinned state.
   *
   * Useful for desktop layouts.
   *
   * [(pinned)]="sidebarPinned"
   */
  readonly pinned = model<boolean>(false);

  readonly responsive = input<NgxDrawerResponsive>(DEFAULT_DRAWER_RESPONSIVE);

  /**
   * Whether clicking backdrop closes drawer.
   */
  readonly closeOnBackdrop = input(true);

  /**
   * Whether Escape closes drawer.
   */
  readonly closeOnEscape = input(true);

  /**
   * Whether body scrolling should be locked
   * while an overlay drawer is open.
   */
  readonly lockBodyScroll = input(true);

  /**
   * Animation duration in milliseconds.
   */
  readonly animationDuration = input(280);

  /**
   * z-index.
   */
  readonly zIndex = input(1000);

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isMobile = signal(false);

  readonly initialized = signal(false);

  /**
   * Used to avoid applying responsive defaults repeatedly.
   */
  private previousResponsiveMode: 'desktop' | 'mobile' | null = null;

  private mediaQuery?: MediaQueryList;

  private removeMediaQueryListener?: () => void;

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  readonly responsiveConfig = computed(() => {
    const config = this.responsive();

    return {
      ...DEFAULT_DRAWER_RESPONSIVE,
      ...config,
    };
  });

  readonly currentMode = computed<'desktop' | 'mobile'>(() => {
    const config = this.responsiveConfig();

    if (config.mode === 'desktop') {
      return 'desktop';
    }

    if (config.mode === 'mobile') {
      return 'mobile';
    }

    return this.isMobile() ? 'mobile' : 'desktop';
  });

  readonly currentBehavior = computed<NgxDrawerBehavior>(() => {
    const config = this.responsiveConfig();

    return this.currentMode() === 'mobile' ? config.mobileBehavior : config.desktopBehavior;
  });

  readonly isOverlay = computed(() => {
    return this.currentBehavior() === 'overlay';
  });

  readonly isDocked = computed(() => {
    return this.currentBehavior() === 'dock';
  });

  readonly shouldShowBackdrop = computed(() => {
    return this.isOverlay() && this.open();
  });

  readonly drawerWidth = computed(() => {
    const width = this.width();

    if (typeof width === 'number') {
      return `${width}px`;
    }

    return width;
  });

  readonly drawerVisible = computed(() => {
    return this.open();
  });

  readonly shouldPreservePinned = computed(() => {
    return this.responsiveConfig().respectPinned;
  });

  readonly isPinnedAndDesktop = computed(() => {
    return this.currentMode() === 'desktop' && this.pinned() && this.shouldPreservePinned();
  });

  // ---------------------------------------------------------------------------
  // Host bindings
  // ---------------------------------------------------------------------------

  @HostBinding('class.drawer-start')
  get drawerStart(): boolean {
    return this.side() === 'start';
  }

  @HostBinding('class.drawer-end')
  get drawerEnd(): boolean {
    return this.side() === 'end';
  }

  @HostBinding('class.drawer-open')
  get drawerOpen(): boolean {
    return this.open();
  }

  @HostBinding('class.drawer-mobile')
  get drawerMobile(): boolean {
    return this.currentMode() === 'mobile';
  }

  @HostBinding('class.drawer-desktop')
  get drawerDesktop(): boolean {
    return this.currentMode() === 'desktop';
  }

  @HostBinding('class.drawer-overlay')
  get drawerOverlay(): boolean {
    return this.isOverlay();
  }

  @HostBinding('class.drawer-dock')
  get drawerDock(): boolean {
    return this.isDocked();
  }

  @HostBinding('style.--ngx-drawer-width')
  get hostWidth(): string {
    return this.drawerWidth();
  }

  @HostBinding('style.--ngx-drawer-duration')
  get hostDuration(): string {
    return `${this.animationDuration()}ms`;
  }

  @HostBinding('style.--ngx-drawer-z-index')
  get hostZIndex(): number {
    return this.zIndex();
  }

  @HostBinding('class.effect-none')
  get effectNone(): boolean {
    return this.effect() === 'none';
  }

  @HostBinding('class.effect-fabric')
  get effectFabric(): boolean {
    return this.effect() === 'fabric';
  }

  @HostBinding('class.effect-slide')
  get effectSlide(): boolean {
    return this.effect() === 'slide';
  }

  @HostBinding('class.effect-push')
  get effectPush(): boolean {
    return this.effect() === 'push';
  }

  @HostBinding('class.effect-scale')
  get effectScale(): boolean {
    return this.effect() === 'scale';
  }

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor() {
    this.setupResponsive();

    effect(() => {
      const mode = this.currentMode();

      if (!this.initialized()) {
        return;
      }

      this.handleResponsiveModeChange(mode);
    });

    effect(() => {
      const shouldLock = this.lockBodyScroll();
      const shouldLockNow = this.isOverlay() && this.open();

      if (!shouldLock) {
        return;
      }

      if (shouldLockNow) {
        this.lockScroll();
      } else {
        this.unlockScroll();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.destroyResponsive();

      this.unlockScroll();
    });
  }

  // ---------------------------------------------------------------------------
  // Responsive
  // ---------------------------------------------------------------------------

  private setupResponsive(): void {
    if (!this.isBrowser) {
      return;
    }

    afterNextRender(() => {
      this.setupMediaQuery();

      this.initialized.set(true);

      const mode = this.currentMode();

      this.previousResponsiveMode = mode;

      this.applyInitialResponsiveState(mode);
    });
  }

  private setupMediaQuery(): void {
    const config = this.responsiveConfig();

    if (config.mode !== 'auto') {
      this.isMobile.set(config.mode === 'mobile');

      return;
    }

    const breakpoint = config.breakpoint;

    this.mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);

    this.updateMobileState();

    const listener = () => {
      this.updateMobileState();
    };

    this.mediaQuery.addEventListener('change', listener);

    this.removeMediaQueryListener = () => {
      this.mediaQuery?.removeEventListener('change', listener);
    };
  }

  private updateMobileState(): void {
    if (!this.mediaQuery) {
      return;
    }

    this.isMobile.set(this.mediaQuery.matches);
  }

  private handleResponsiveModeChange(mode: 'desktop' | 'mobile'): void {
    if (this.previousResponsiveMode === null) {
      this.previousResponsiveMode = mode;
      return;
    }

    if (this.previousResponsiveMode === mode) {
      return;
    }

    const previousMode = this.previousResponsiveMode;

    this.previousResponsiveMode = mode;

    const config = this.responsiveConfig();

    /**
     * If pinned should be respected,
     * don't overwrite the current open state.
     */
    if (config.respectPinned && this.pinned()) {
      return;
    }

    if (mode === 'desktop') {
      this.open.set(config.desktopOpen);
    } else {
      this.open.set(config.mobileOpen);
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-previous-mode', previousMode);
  }

  private applyInitialResponsiveState(mode: 'desktop' | 'mobile'): void {
    const config = this.responsiveConfig();

    if (config.respectPinned && this.pinned()) {
      return;
    }

    /**
     * Don't blindly overwrite an explicitly bound
     * [(open)] value after initialization.
     *
     * The default is only applied when the model
     * has not already been initialized.
     */
    if (mode === 'desktop') {
      this.open.set(config.desktopOpen);
    } else {
      this.open.set(config.mobileOpen);
    }
  }

  private destroyResponsive(): void {
    this.removeMediaQueryListener?.();

    this.mediaQuery = undefined;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.openDrawer();
    }
  }

  openDrawer(): void {
    this.open.set(true);
  }

  close(): void {
    if (this.pinned() && this.isPinnedAndDesktop()) {
      return;
    }

    this.open.set(false);
  }

  pin(): void {
    this.pinned.set(true);
    this.open.set(true);
  }

  unpin(): void {
    this.pinned.set(false);
  }

  togglePinned(): void {
    if (this.pinned()) {
      this.unpin();
    } else {
      this.pin();
    }
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  onBackdropClick(): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    this.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    if (!this.open()) {
      return;
    }

    this.close();
  }

  // ---------------------------------------------------------------------------
  // Scroll locking
  // ---------------------------------------------------------------------------

  private lockScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!document.body) {
      return;
    }

    if (document.body.dataset['ngxDrawerScrollLocked'] === 'true') {
      return;
    }

    this.renderer.setAttribute(document.body, 'data-ngx-drawer-scroll-locked', 'true');

    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  private unlockScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!document.body) {
      return;
    }

    if (document.body.dataset['ngxDrawerScrollLocked'] !== 'true') {
      return;
    }

    this.renderer.removeAttribute(document.body, 'data-ngx-drawer-scroll-locked');

    this.renderer.removeStyle(document.body, 'overflow');
  }
}
