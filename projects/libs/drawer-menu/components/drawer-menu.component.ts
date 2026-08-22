import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { DirectionService } from 'ngx-kit/shared';
import {
  NgxDrawerEffect,
  NgxDrawerMode,
  NgxDrawerResponsiveConfig,
  NgxDrawerSide,
} from '../contracts/drawer-menu-types';

@Component({
  selector: 'ngx-drawer-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  host: {
    class: 'ngx-drawer-menu-host',
    '(keydown.escape)': 'onEscape()',
  },
})
export class NgxDrawerMenuComponent {
  readonly side = input<NgxDrawerSide>('start');
  readonly mode = input<NgxDrawerMode>('overlay');
  readonly effect = input<NgxDrawerEffect>('fabric');

  readonly width = input<number>(300);
  readonly maxWidth = input<number>(420);
  readonly edgeSize = input<number>(34);
  readonly dragThreshold = input<number>(0.38);
  readonly velocityThreshold = input<number>(0.45);

  /** Opens/closes the panel from the edge and while the panel itself is dragged. */
  readonly swipeEnabled = input<boolean>(true);
  /** Allows closing by clicking the backdrop. */
  readonly backdropClose = input<boolean>(true);
  /** Allows Escape to close the drawer. */
  readonly escapeClose = input<boolean>(true);

  /** The drawer starts open unless explicitly configured otherwise. */
  readonly open = model<boolean>(true);
  /** Pinned drawers are intended for persistent desktop navigation. */
  readonly pinned = model<boolean>(false);

  /** Responsive behavior. Can be overridden with individual inputs below. */
  readonly responsive = input<NgxDrawerResponsiveConfig>({
    mode: 'auto',
    breakpoint: 768,
    desktopOpen: true,
    mobileOpen: false,
    respectPinned: true,
  });

  /** Convenience aliases for the common responsive configuration. */
  readonly respondToViewport = input<boolean>(true);
  readonly mobileBreakpoint = input<number>(768);
  readonly openOnDesktop = input<boolean>(true);
  readonly openOnMobile = input<boolean>(false);

  /** Visual tuning. */
  readonly curtainStrips = input<number>(9);
  readonly backdropOpacity = input<number>(0.46);
  readonly transitionMs = input<number>(420);
  readonly focusOnOpen = input<boolean>(true);

  protected readonly dragProgress = signal<number | null>(null);
  protected readonly dragVelocity = signal<number>(0);
  protected readonly isDragging = computed(() => this.dragProgress() !== null);
  protected readonly progress = computed(() => this.dragProgress() ?? (this.open() ? 1 : 0));
  protected readonly isActuallyOpen = computed(() => this.progress() > 0.001);
  protected readonly strips = computed(() =>
    Array.from({ length: Math.max(3, this.curtainStrips()) }, (_, i) => i),
  );

  /** Physical side: true means the drawer is attached to the physical left edge. */
  protected readonly isPhysicalLeft = computed(() => {
    const rtl = this.directionService.isRtl();
    return this.side() === 'start' ? !rtl : rtl;
  });

  protected readonly physicalSign = computed(() => (this.isPhysicalLeft() ? 1 : -1));
  protected readonly duration = computed(() => `${this.transitionMs()}ms`);

  private readonly directionService = inject(DirectionService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private pointerId: number | null = null;
  private dragStartX = 0;
  private dragStartProgress = 0;
  private dragLastX = 0;
  private dragLastTime = 0;
  private lastVelocity = 0;
  private activePointerTarget: HTMLElement | null = null;
  private resizeObserver?: ResizeObserver;
  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;
  private lastManagedViewportState: boolean | null = null;

  constructor() {
    effect((onCleanup) => {
      const locked = this.open() && this.mode() === 'overlay';
      if (!locked) return;

      const body = this.document.body;
      const previous = body.style.overflow;
      body.style.overflow = 'hidden';
      onCleanup(() => (body.style.overflow = previous));
    });

    effect(() => {
      const config = this.responsive();
      const enabled = this.respondToViewport() && config.mode !== 'off';
      const breakpoint = config.breakpoint ?? this.mobileBreakpoint();
      const desktopOpen = config.desktopOpen ?? this.openOnDesktop();
      const mobileOpen = config.mobileOpen ?? this.openOnMobile();

      this.setupViewportSync(
        enabled,
        breakpoint,
        desktopOpen,
        mobileOpen,
        config.respectPinned ?? true,
      );
    });

    this.destroyRef.onDestroy(() => {
      this.disposePointer();
      this.disposeViewportSync();
    });
  }

  toggle(): void {
    if (this.pinned() && this.open()) return;
    this.open.update((value) => !value);
  }

  openDrawer(): void {
    this.open.set(true);
  }

  closeDrawer(): void {
    if (!this.pinned()) this.open.set(false);
  }

  pin(): void {
    this.pinned.set(true);
    this.open.set(true);
  }

  unpin(): void {
    this.pinned.set(false);
  }

  protected onEscape(): void {
    if (this.escapeClose() && !this.pinned()) this.closeDrawer();
  }

  protected onBackdropPointerDown(event: PointerEvent): void {
    if (!this.backdropClose() || this.pinned()) return;
    event.preventDefault();
    this.closeDrawer();
  }

  protected onEdgePointerDown(event: PointerEvent): void {
    if (!this.swipeEnabled() || this.open() || this.pinned()) return;
    this.beginDrag(event, 0);
  }

  protected onPanelPointerDown(event: PointerEvent): void {
    if (!this.swipeEnabled() || !this.open() || this.pinned()) return;
    if (event.button !== 0) return;
    this.beginDrag(event, 1);
  }

  private beginDrag(event: PointerEvent, startProgress: number): void {
    if (this.pointerId !== null) return;

    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    this.pointerId = event.pointerId;
    this.activePointerTarget = target;
    this.dragStartX = event.clientX;
    this.dragLastX = event.clientX;
    this.dragLastTime = performance.now();
    this.dragStartProgress = startProgress;
    this.lastVelocity = 0;
    this.dragProgress.set(startProgress);

    target.setPointerCapture?.(event.pointerId);
    event.preventDefault();

    target.addEventListener('pointermove', this.onPointerMove);
    target.addEventListener('pointerup', this.onPointerUp);
    target.addEventListener('pointercancel', this.onPointerCancel);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;

    const now = performance.now();
    const dx = event.clientX - this.dragStartX;
    const signedDistance = dx * this.physicalSign();
    const next = this.clamp01(this.dragStartProgress + signedDistance / this.width());

    const dt = Math.max(8, now - this.dragLastTime);
    this.lastVelocity = ((event.clientX - this.dragLastX) * this.physicalSign()) / dt;
    this.dragVelocity.set(this.lastVelocity);
    this.dragLastX = event.clientX;
    this.dragLastTime = now;

    this.dragProgress.set(next);
    event.preventDefault();
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;

    const progress = this.dragProgress() ?? this.dragStartProgress;
    const velocity = this.dragVelocity();
    const opening = velocity > this.velocityThreshold();
    const closing = velocity < -this.velocityThreshold();

    let shouldOpen: boolean;
    if (opening) shouldOpen = true;
    else if (closing) shouldOpen = false;
    else shouldOpen = progress >= this.dragThreshold();

    this.open.set(shouldOpen);
    this.dragProgress.set(null);
    this.dragVelocity.set(0);
    this.disposePointer(event.pointerId);
  };

  private readonly onPointerCancel = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    const progress = this.dragProgress() ?? this.dragStartProgress;
    this.open.set(progress >= 0.5);
    this.dragProgress.set(null);
    this.dragVelocity.set(0);
    this.disposePointer(event.pointerId);
  };

  private disposePointer(pointerId?: number): void {
    if (pointerId !== undefined && this.pointerId !== pointerId) return;

    const target = this.activePointerTarget;
    if (target) {
      target.removeEventListener('pointermove', this.onPointerMove);
      target.removeEventListener('pointerup', this.onPointerUp);
      target.removeEventListener('pointercancel', this.onPointerCancel);
      if (this.pointerId !== null) {
        try {
          target.releasePointerCapture?.(this.pointerId);
        } catch {
          // Pointer capture may already be released by the browser.
        }
      }
    }

    this.pointerId = null;
    this.activePointerTarget = null;
  }

  private setupViewportSync(
    enabled: boolean,
    breakpoint: number,
    desktopOpen: boolean,
    mobileOpen: boolean,
    respectPinned: boolean,
  ): void {
    this.disposeViewportSync();
    if (!enabled || typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia(`(max-width: ${Math.max(0, breakpoint - 0.02)}px)`);

    const apply = (isMobile: boolean) => {
      if (respectPinned && this.pinned()) return;

      const next = isMobile ? mobileOpen : desktopOpen;
      if (this.lastManagedViewportState === next) return;
      this.lastManagedViewportState = next;
      this.open.set(next);
    };

    apply(this.mediaQuery.matches);
    this.mediaQueryListener = (event) => apply(event.matches);
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  private disposeViewportSync(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    this.mediaQuery = undefined;
    this.mediaQueryListener = undefined;
    this.lastManagedViewportState = null;
  }

  private clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
  }
}
