import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  input,
  output,
  inject,
  signal,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxInfiniteScrollDirection, NgxInfiniteScrollEvent } from '../types/infinite-scroll.types';

const DEFAULT_DISTANCE = 200;
const DEFAULT_MIN_INTERVAL = 100;
const PREPEND_MAX_WAIT_MS = 5000;
const MANUAL_CHECK_DELAY_MS = 0;

@Directive({
  selector: '[infiniteScroll]',
  standalone: true,
  exportAs: 'infiniteScroll',
})
export class NgxInfiniteScroll implements AfterViewInit {
  readonly infiniteScrollDistance = input(DEFAULT_DISTANCE, {
    alias: 'infiniteScrollDistance',
    transform: numberInput,
  });

  readonly infiniteScrollDisabled = input(false, {
    alias: 'infiniteScrollDisabled',
    transform: booleanInput,
  });

  readonly infiniteScrollImmediateCheck = input(true, {
    alias: 'infiniteScrollImmediateCheck',
    transform: booleanInput,
  });

  readonly infiniteScrollMinInterval = input(DEFAULT_MIN_INTERVAL, {
    alias: 'infiniteScrollMinInterval',
    transform: numberInput,
  });

  readonly infiniteScrollUpDistance = input<number | null>(null, {
    alias: 'infiniteScrollUpDistance',
    transform: nullableNumberInput,
  });

  readonly infiniteScrollDownDistance = input<number | null>(null, {
    alias: 'infiniteScrollDownDistance',
    transform: nullableNumberInput,
  });

  readonly infiniteScrollDirection = input<NgxInfiniteScrollDirection>('down', {
    alias: 'infiniteScrollDirection',
  });

  readonly infiniteScrollContainer = input<string | HTMLElement | null>(null, {
    alias: 'infiniteScrollContainer',
  });

  readonly infiniteScrollRoot = input<HTMLElement | null>(null, {
    alias: 'infiniteScrollRoot',
  });

  readonly scrollWindow = input(true, {
    alias: 'scrollWindow',
    transform: booleanInput,
  });

  readonly fromRoot = input(false, {
    alias: 'fromRoot',
    transform: booleanInput,
  });

  /** Preserve the visual scroll position when older content is prepended. */
  readonly infiniteScrollMaintainScrollPosition = input(true, {
    alias: 'infiniteScrollMaintainScrollPosition',
    transform: booleanInput,
  });

  /** Optional CSS scroll behavior used while compensating a prepend. */
  readonly infiniteScrollPreserveScrollBehavior = input<ScrollBehavior>('auto', {
    alias: 'infiniteScrollPreserveScrollBehavior',
  });

  readonly scrolled = output<NgxInfiniteScrollEvent>();
  readonly scrolledUp = output<NgxInfiniteScrollEvent>();
  readonly scrolledDown = output<NgxInfiniteScrollEvent>();
  readonly scrollStartReached = output<NgxInfiniteScrollEvent>();
  readonly scrollEndReached = output<NgxInfiniteScrollEvent>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly ready = signal(false);
  private previousConfiguration?: {
    distance: number;
    upDistance: number | null;
    downDistance: number | null;
    direction: NgxInfiniteScrollDirection;
    scrollWindow: boolean;
    fromRoot: boolean;
    container: string | HTMLElement | null;
    root: HTMLElement | null;
  };
  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private topSentinel?: HTMLElement;
  private bottomSentinel?: HTMLElement;
  private root: HTMLElement | null = null;
  private lastTriggerAt = Number.NEGATIVE_INFINITY;
  private armedUp = true;
  private armedDown = true;
  private destroyRequested = false;
  private prependFrame = 0;

  private prependSnapshot?: {
    scrollTop: number;
    scrollHeight: number;
  };

  constructor() {
    effect(() => {
      const disabled = this.infiniteScrollDisabled();
      const configuration = {
        distance: this.infiniteScrollDistance(),
        upDistance: this.infiniteScrollUpDistance(),
        downDistance: this.infiniteScrollDownDistance(),
        direction: this.infiniteScrollDirection(),
        scrollWindow: this.scrollWindow(),
        fromRoot: this.fromRoot(),
        container: this.infiniteScrollContainer(),
        root: this.infiniteScrollRoot(),
      };

      if (!this.ready() || !isPlatformBrowser(this.platformId)) {
        return;
      }

      this.zone.runOutsideAngular(() => {
        if (!this.sameConfiguration(configuration)) {
          this.previousConfiguration = configuration;
          this.setup();
        }

        if (disabled) {
          this.armedUp = true;
          this.armedDown = true;
          return;
        }

        this.armedUp = true;
        this.armedDown = true;
        if (this.infiniteScrollImmediateCheck()) {
          this.scheduleCheck();
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      this.destroyRequested = true;
      this.destroyObserver();
      this.clearSentinels();
      this.cancelPrependWatcher();
    });
  }

  ngAfterViewInit(): void {
    this.ready.set(true);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.previousConfiguration = undefined;
      this.setup();
      if (this.infiniteScrollImmediateCheck()) {
        this.scheduleCheck();
      }
    });
  }

  /**
   * Re-check the sentinels after application code has appended/prepended data.
   * Usually not needed, but useful for custom rendering pipelines.
   */
  check(): void {
    if (!this.ready() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.armedUp = true;
    this.armedDown = true;
    this.scheduleCheck();
  }

  /**
   * Explicitly finish a pending prepend operation.
   * Useful when an application knows exactly when its async batch has rendered.
   */
  completePrepend(): void {
    this.tryCompensatePrepend(true);
  }

  private sameConfiguration(next: NonNullable<typeof this.previousConfiguration>): boolean {
    const previous = this.previousConfiguration;
    if (!previous) return false;

    return (
      previous.distance === next.distance &&
      previous.upDistance === next.upDistance &&
      previous.downDistance === next.downDistance &&
      previous.direction === next.direction &&
      previous.scrollWindow === next.scrollWindow &&
      previous.fromRoot === next.fromRoot &&
      previous.container === next.container &&
      previous.root === next.root
    );
  }

  private setup(): void {
    this.destroyObserver();
    this.clearSentinels();

    this.root = this.resolveRoot();

    this.topSentinel = this.createSentinel('top');
    this.bottomSentinel = this.createSentinel('bottom');

    const host = this.hostRef.nativeElement;

    host.prepend(this.topSentinel);
    host.append(this.bottomSentinel);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (entry.target === this.topSentinel) this.armedUp = true;
            if (entry.target === this.bottomSentinel) this.armedDown = true;
            continue;
          }

          if (entry.target === this.topSentinel && this.allowsDirection('up')) {
            this.trigger('up');
          }

          if (entry.target === this.bottomSentinel && this.allowsDirection('down')) {
            this.trigger('down');
          }
        }
      },
      {
        root: this.root,
        rootMargin: this.buildRootMargin(),
        threshold: 0,
      },
    );

    this.observer.observe(this.topSentinel);
    this.observer.observe(this.bottomSentinel);

    this.resizeObserver = new ResizeObserver(() => {
      if (this.destroyRequested) return;
      if (this.prependSnapshot) {
        this.tryCompensatePrepend(false);
      }
      if (!this.infiniteScrollDisabled() && this.infiniteScrollImmediateCheck()) {
        this.scheduleCheck();
      }
    });

    const observedRoot = this.root ?? this.getDocumentScroller();
    if (observedRoot) {
      this.resizeObserver.observe(observedRoot);
    }
    this.resizeObserver.observe(host);

    this.mutationObserver = new MutationObserver(() => {
      if (this.destroyRequested) return;
      if (this.prependSnapshot) {
        this.tryCompensatePrepend(false);
      }
      if (!this.infiniteScrollDisabled() && this.infiniteScrollImmediateCheck()) {
        this.scheduleCheck();
      }
    });

    this.mutationObserver.observe(host, {
      childList: true,
      subtree: true,
    });
  }

  private trigger(direction: 'up' | 'down'): void {
    if (this.infiniteScrollDisabled()) {
      return;
    }

    const armed = direction === 'up' ? this.armedUp : this.armedDown;
    if (!armed) {
      return;
    }

    const now = performance.now();
    if (now - this.lastTriggerAt < Math.max(0, this.infiniteScrollMinInterval())) {
      return;
    }

    const target = this.hostRef.nativeElement;
    const event: NgxInfiniteScrollEvent = {
      direction,
      distance: this.distanceFor(direction),
      target,
      root: this.root,
    };

    this.lastTriggerAt = now;

    if (direction === 'up') {
      this.armedUp = false;
      if (this.infiniteScrollMaintainScrollPosition()) {
        this.capturePrependSnapshot();
      }
    } else {
      this.armedDown = false;
    }

    this.zone.run(() => {
      this.scrolled.emit(event);
      if (direction === 'up') {
        this.scrolledUp.emit(event);
        this.scrollStartReached.emit(event);
      } else {
        this.scrolledDown.emit(event);
        this.scrollEndReached.emit(event);
      }
    });
  }

  private allowsDirection(direction: 'up' | 'down'): boolean {
    const configured = this.infiniteScrollDirection();
    return configured === 'both' || configured === direction;
  }

  private resolveRoot(): HTMLElement | null {
    if (this.scrollWindow()) {
      return null;
    }

    const explicit = this.infiniteScrollRoot();
    if (explicit) {
      return explicit;
    }

    const container = this.infiniteScrollContainer();

    if (container instanceof HTMLElement) {
      return container;
    }

    if (typeof container === 'string' && container.trim()) {
      const scope: ParentNode = this.fromRoot() ? document : this.hostRef.nativeElement;
      return scope.querySelector<HTMLElement>(container) ?? this.hostRef.nativeElement;
    }

    return this.hostRef.nativeElement;
  }

  private buildRootMargin(): string {
    const up = this.distanceFor('up');
    const down = this.distanceFor('down');
    const direction = this.infiniteScrollDirection();

    if (direction === 'up') {
      return `${up}px 0px 0px 0px`;
    }

    if (direction === 'down') {
      return `0px 0px ${down}px 0px`;
    }

    return `${up}px 0px ${down}px 0px`;
  }

  private createSentinel(position: 'top' | 'bottom'): HTMLElement {
    const node = document.createElement('span');
    node.dataset['ngxInfiniteScrollSentinel'] = position;
    node.setAttribute('aria-hidden', 'true');
    node.style.display = 'block';
    node.style.width = '1px';
    node.style.height = '1px';
    node.style.margin = '0';
    node.style.padding = '0';
    node.style.border = '0';
    node.style.pointerEvents = 'none';
    node.style.visibility = 'hidden';
    return node;
  }

  private scheduleCheck(): void {
    window.setTimeout(() => {
      if (this.destroyRequested || this.infiniteScrollDisabled()) return;
      this.checkVisibilityDirectly();
    }, MANUAL_CHECK_DELAY_MS);
  }

  private checkVisibilityDirectly(): void {
    if (!this.topSentinel || !this.bottomSentinel || this.infiniteScrollDisabled()) {
      return;
    }

    const rootRect = this.root
      ? this.root.getBoundingClientRect()
      : { top: 0, bottom: window.innerHeight };

    const rootTop = rootRect.top;
    const rootBottom = rootRect.bottom;
    const upDistance = this.distanceFor('up');
    const downDistance = this.distanceFor('down');

    if (this.allowsDirection('up') && this.armedUp) {
      const rect = this.topSentinel.getBoundingClientRect();
      if (rect.bottom >= rootTop - upDistance && rect.top <= rootBottom) {
        this.trigger('up');
      }
    }

    if (this.allowsDirection('down') && this.armedDown) {
      const rect = this.bottomSentinel.getBoundingClientRect();
      if (rect.top <= rootBottom + downDistance && rect.bottom >= rootTop) {
        this.trigger('down');
      }
    }
  }

  private distanceFor(direction: 'up' | 'down'): number {
    const override =
      direction === 'up' ? this.infiniteScrollUpDistance() : this.infiniteScrollDownDistance();
    return Math.max(0, override ?? this.infiniteScrollDistance());
  }

  private getDocumentScroller(): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null;
  }

  private getScrollMetrics(): {
    element: HTMLElement | null;
    scrollTop: number;
    scrollHeight: number;
  } {
    const element = this.root ?? this.getDocumentScroller();
    if (element) {
      return {
        element,
        scrollTop: element.scrollTop,
        scrollHeight: element.scrollHeight,
      };
    }

    return {
      element: null,
      scrollTop: window.scrollY,
      scrollHeight: Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
      ),
    };
  }

  private capturePrependSnapshot(): void {
    const metrics = this.getScrollMetrics();
    this.prependSnapshot = {
      scrollTop: metrics.scrollTop,
      scrollHeight: metrics.scrollHeight,
    };

    this.watchPrepend();
  }

  private watchPrepend(): void {
    this.cancelPrependWatcher();

    const startedAt = performance.now();

    const frame = () => {
      if (!this.prependSnapshot || this.destroyRequested) {
        this.prependFrame = 0;
        return;
      }

      const compensated = this.tryCompensatePrepend(false);
      if (compensated || performance.now() - startedAt >= PREPEND_MAX_WAIT_MS) {
        this.prependFrame = 0;
        return;
      }

      this.prependFrame = window.requestAnimationFrame(frame);
    };

    this.prependFrame = window.requestAnimationFrame(frame);
  }

  private tryCompensatePrepend(force: boolean): boolean {
    const snapshot = this.prependSnapshot;
    if (!snapshot) return true;

    const metrics = this.getScrollMetrics();
    const delta = metrics.scrollHeight - snapshot.scrollHeight;

    if (delta <= 0) {
      if (force) {
        this.prependSnapshot = undefined;
        this.cancelPrependWatcher();
      }
      return false;
    }

    /*
     * Do not fight an intentional user scroll while the request is in-flight.
     * A tiny tolerance absorbs layout rounding and browser scroll anchoring.
     */
    const currentTop = metrics.scrollTop;
    const movedByUser = Math.abs(currentTop - snapshot.scrollTop) > 4;

    if (!movedByUser || force) {
      const nextTop = snapshot.scrollTop + delta;

      if (metrics.element) {
        metrics.element.scrollTo({
          top: nextTop,
          behavior: this.infiniteScrollPreserveScrollBehavior(),
        });
      } else {
        window.scrollTo({
          top: nextTop,
          behavior: this.infiniteScrollPreserveScrollBehavior(),
        });
      }

      this.prependSnapshot = undefined;
      this.cancelPrependWatcher();
      return true;
    }

    return false;
  }

  private cancelPrependWatcher(): void {
    if (this.prependFrame) {
      window.cancelAnimationFrame(this.prependFrame);
      this.prependFrame = 0;
    }
  }

  private destroyObserver(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.observer = undefined;
    this.resizeObserver = undefined;
    this.mutationObserver = undefined;
  }

  private clearSentinels(): void {
    this.topSentinel?.remove();
    this.bottomSentinel?.remove();
    this.topSentinel = undefined;
    this.bottomSentinel = undefined;
  }
}

function numberInput(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullableNumberInput(value: number | string | null | undefined | unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function booleanInput(value: boolean | string | null | undefined): boolean {
  if (value === '' || value === true) return true;
  if (value === 'false' || value === false || value == null) return false;
  return Boolean(value);
}
