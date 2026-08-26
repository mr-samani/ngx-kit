import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { NgxVirtualScrollRange, rangesEqual } from '../types/virtual-scroll-range.interface';
import {
  NgxVirtualScrollAxis,
  NgxVirtualScrollMeasureFn,
  NgxVirtualScrollMeasurement,
} from '../types/virtual-scroll-measurement.interface';
import { measureLayout } from '../utils/measure-layout';

/** How many items are rendered "in the open" (no transform) purely to probe their real layout. */
const PROBE_COUNT = 24;

/**
 * Browsers clamp any single element's CSS width/height (and therefore
 * `scrollWidth`/`scrollHeight`) to a hard maximum — roughly 33,554,428px in
 * Chromium and considerably less in older WebKit (historically ~8,388,608px)
 * and Gecko (~17,895,697px). Once the spacer element (used purely to give
 * the native scrollbar the right size) exceeds that ceiling, the browser
 * silently clamps it, the scrollbar stops early, and everything past that
 * point becomes unreachable — exactly the "stuck around 524k rows" symptom.
 *
 * To support arbitrarily large data sets we cap the spacer at this safe
 * ceiling and scroll the DOM in a *compressed* coordinate space, while all
 * index math still happens against the real, uncompressed pixel space (see
 * `scaleFactor`). Kept conservative (well under every known browser cap) so
 * it works everywhere without per-browser detection.
 */
const DEFAULT_MAX_AXIS_SIZE_PX = 6_000_000;

/**
 * Headless, signal-based virtual scroll viewport.
 *
 * There is no `itemSize` and no `orientation` input by design: both are
 * derived by measuring the real, rendered bounding boxes of a small probe
 * batch (see `measure-layout.ts`), so margins/border/box-shadow on your own
 * item styles are always accounted for correctly, and mixed layouts
 * (vertical list of wrapping rows, i.e. a card grid) are supported out of
 * the box.
 *
 * The component does not render your items itself — it exposes reactive
 * signals (`visibleItems`, `range`, `baseIndex`, `axis`, ...) that you
 * consume with a native `@for` block in your own template. This keeps the
 * repeat/track logic entirely under your control (custom track expressions,
 * `@empty` blocks, etc.) instead of hiding it behind a structural directive.
 *
 * @example
 * ```html
 * <ngx-virtual-scroll-viewport #vs="ngxVirtualScrollViewport" [items]="rows" style="height: 480px">
 *   @for (row of vs.visibleItems(); track row.id; let i = $index) {
 *     <div class="row">{{ vs.baseIndex() + i }} - {{ row.name }}</div>
 *   }
 * </ngx-virtual-scroll-viewport>
 * ```
 */
@Component({
  selector: 'ngx-virtual-scroll-viewport, ngx-virtual-scroll',
  standalone: true,
  templateUrl: './virtual-scroll-viewport.component.html',
  styleUrl: './virtual-scroll-viewport.component.scss',
  exportAs: 'ngxVirtualScrollViewport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-virtual-scroll-viewport-host',
    '[class.ngx-virtual-scroll-viewport-host--scrolling]': 'isScrolling()',
  },
})
export class NgxVirtualScrollViewport<T = unknown> {
  /** The full, unvirtualized data set. */
  readonly items = input<readonly T[]>([]);

  /** Minimum buffer (px) left before the render range is recomputed. */
  readonly minBufferPx = input(150);

  /** Extra buffer (px) rendered outside the visible area on each side. */
  readonly maxBufferPx = input(300);

  /** Advanced escape hatch: replace the built-in layout probe entirely. */
  readonly measureFn = input<NgxVirtualScrollMeasureFn | undefined>(undefined);

  /**
   * Safe ceiling (px) for the scrollable axis's real DOM size. Only relevant
   * for very large data sets — see `DEFAULT_MAX_AXIS_SIZE_PX`. You should
   * not need to change this; it's exposed only for advanced cases (e.g. you
   * know your app never targets older WebKit and want to raise the ceiling).
   */
  readonly maxAxisSizePx = input(DEFAULT_MAX_AXIS_SIZE_PX);

  /** Emits the index of the first fully-visible item as the user scrolls. */
  readonly scrolledIndexChange = output<number>();

  /** Emits whenever the rendered line range changes. */
  readonly rangeChange = output<NgxVirtualScrollRange>();

  private readonly scrollableRef = viewChild.required<ElementRef<HTMLElement>>('scrollable');
  private readonly wrapperRef = viewChild.required<ElementRef<HTMLElement>>('wrapper');

  private readonly destroyRef = inject(DestroyRef);

  private readonly measurement = signal<NgxVirtualScrollMeasurement | null>(null);
  private readonly scrollOffset = signal(0);
  private readonly viewportSize = signal(0);

  /** Whether the user is actively scrolling (used only to toggle `will-change`). */
  readonly isScrolling = signal(false);

  /** Currently rendered line range. */
  readonly range = signal<NgxVirtualScrollRange>({ start: 0, end: PROBE_COUNT });

  readonly axis = computed<NgxVirtualScrollAxis>(() => this.measurement()?.axis ?? 'vertical');
  readonly crossCount = computed(() => this.measurement()?.crossCount ?? 1);
  readonly lineSize = computed(() => this.measurement()?.lineSize ?? 0);
  readonly isMeasured = computed(() => this.measurement() !== null);

  readonly lineCount = computed(() => Math.ceil(this.items().length / this.crossCount()));

  /** Real, uncompressed total size along the scroll axis — can exceed the browser's element-size cap. */
  readonly naturalTotalSize = computed(() => this.lineCount() * this.lineSize());

  /**
   * Size actually applied to the spacer element, clamped to `maxAxisSizePx`.
   * Equal to `naturalTotalSize()` for any data set small enough to matter in
   * practice — the compression only ever engages for extreme list sizes.
   */
  readonly totalSize = computed(() => Math.min(this.naturalTotalSize(), this.maxAxisSizePx()));

  /**
   * Ratio between the (possibly capped) DOM scroll space and the real,
   * uncompressed content size. `1` unless `naturalTotalSize()` exceeds
   * `maxAxisSizePx()`, in which case it's `< 1` and the DOM scrollbar
   * represents the whole data set in a compressed coordinate space.
   */
  readonly scaleFactor = computed(() => {
    const natural = this.naturalTotalSize();
    return natural > 0 ? this.totalSize() / natural : 1;
  });

  /** Absolute index of the first item in `visibleItems()`, for display purposes. */
  readonly baseIndex = computed(() => this.range().start * this.crossCount());

  /** Slice of `items()` that should actually be rendered right now. */
  readonly visibleItems = computed<readonly T[]>(() => {
    const data = this.items();
    const { start, end } = this.range();
    const cross = this.crossCount();
    return data.slice(start * cross, Math.min(data.length, end * cross));
  });

  // Expressed in the same compressed DOM coordinate space as `scrollOffset`/
  // `totalSize`, so it always stays within the safe, capped range even for
  // enormous data sets — see `scaleFactor`.
  //
  // The naive `start * lineSize * scaleFactor` value is only an *ideal*
  // proportional position. It is clamped so the *real* (unscaled) rendered
  // block — `renderedBlockSize()` — can never be pushed past the end of the
  // capped spacer. Without this clamp, once `scaleFactor() < 1`, the block
  // rendered near the tail (real, unscaled size) no longer fits in the tiny
  // sliver of compressed space "ideally" left for it, so it gets positioned
  // partly (or entirely) past the bottom of the scrollable area — reachable
  // in the DOM, but never inside the visible/scrollable viewport. Clamping
  // guarantees the tail of the list is always flush with, and fully inside,
  // the scrollable area.
  private readonly renderedBlockSize = computed(() => {
    const { start, end } = this.range();
    return (end - start) * this.lineSize();
  });

  private readonly contentOffset = computed(() => {
    const ideal = this.range().start * this.lineSize() * this.scaleFactor();
    const max = Math.max(0, this.totalSize() - this.renderedBlockSize());
    return Math.min(ideal, max);
  });

  protected readonly wrapperTransform = computed(() =>
    this.axis() === 'horizontal' ? `translateX(${this.contentOffset()}px)` : `translateY(${this.contentOffset()}px)`
  );
  protected readonly spacerWidth = computed(() => (this.axis() === 'horizontal' ? this.totalSize() : 1));
  protected readonly spacerHeight = computed(() => (this.axis() === 'vertical' ? this.totalSize() : 1));

  private resizeObserver?: ResizeObserver;
  private scrollingIdleTimer?: ReturnType<typeof setTimeout>;
  private scrollRaf = 0;

  constructor() {
    // Seed / reset the probe range whenever the data set changes and we
    // haven't measured a real layout yet.
    effect(() => {
      const length = this.items().length;
      if (!this.measurement()) {
        this.range.set({ start: 0, end: Math.min(length, PROBE_COUNT) });
      }
    });

    // Read the real, rendered layout of the probe batch once it has
    // painted. Runs in the `read` phase so it never interleaves with DOM
    // writes and never forces a layout thrash.
    afterRenderEffect({
      read: () => {
        if (this.measurement()) {
          return;
        }
        const children = Array.from(this.wrapperRef().nativeElement.children).slice(0, PROBE_COUNT);
        const measure = this.measureFn() ?? measureLayout;
        const result = measure(children);
        if (result) {
          this.measurement.set(result);
        }
      },
    });

    // Once measured (or when the buffer inputs change), recompute the
    // actual visible range from the real viewport size / scroll offset.
    // `untracked` is used because `recomputeRange` itself reads scroll/size
    // signals that are already kept in sync by the scroll/resize listeners
    // directly — we only want *this* effect to re-run for buffer/measurement
    // changes, not for every scroll frame.
    effect(() => {
      this.minBufferPx();
      this.maxBufferPx();
      const measured = this.isMeasured();
      untracked(() => {
        if (measured) {
          // The initial viewport-size read (in setupListeners) assumed the
          // default 'vertical' axis before layout was known; now that the
          // real axis is known, re-read clientWidth/clientHeight against it.
          this.measureViewportSize();
          this.recomputeRange(true);
        }
      });
    });

    afterNextRender(() => this.setupListeners());

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      cancelAnimationFrame(this.scrollRaf);
      clearTimeout(this.scrollingIdleTimer);
    });
  }

  /** Programmatically scroll to a given item index. */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    const line = Math.floor(index / this.crossCount());
    this.scrollToOffset(line * this.lineSize(), behavior);
  }

  /**
   * Programmatically scroll to a given pixel offset along the scroll axis.
   * `offset` is expressed in real, uncompressed content px (i.e. the same
   * space as `index * lineSize()`) — internally converted to the
   * (possibly compressed) DOM scroll coordinate via `scaleFactor()`.
   */
  scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
    const el = this.scrollableRef().nativeElement;
    const domOffset = offset * this.scaleFactor();
    const options: ScrollToOptions =
      this.axis() === 'horizontal' ? { left: domOffset, behavior } : { top: domOffset, behavior };
    el.scrollTo(options);
  }

  /** Force a re-measure, e.g. after the container was resized by external layout logic. */
  checkViewportSize(): void {
    this.measureViewportSize();
    this.recomputeRange(true);
  }

  private setupListeners(): void {
    const el = this.scrollableRef().nativeElement;

    el.addEventListener('scroll', this.onScroll, { passive: true });
    this.destroyRef.onDestroy(() => el.removeEventListener('scroll', this.onScroll));

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.checkViewportSize());
      this.resizeObserver.observe(el);
    }

    this.measureViewportSize();
  }

  private readonly onScroll = (): void => {
    if (this.scrollRaf) {
      return;
    }
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      this.markScrolling();

      const el = this.scrollableRef().nativeElement;
      const offset = this.axis() === 'horizontal' ? el.scrollLeft : el.scrollTop;
      this.scrollOffset.set(offset);
      this.recomputeRange(false);

      const size = this.lineSize();
      if (size > 0) {
        const realOffset = offset / this.scaleFactor();
        this.scrolledIndexChange.emit(Math.floor(realOffset / size) * this.crossCount());
      }
    });
  };

  private markScrolling(): void {
    this.isScrolling.set(true);
    clearTimeout(this.scrollingIdleTimer);
    this.scrollingIdleTimer = setTimeout(() => this.isScrolling.set(false), 150);
  }

  private measureViewportSize(): void {
    const el = this.scrollableRef().nativeElement;
    const size = this.axis() === 'horizontal' ? el.clientWidth : el.clientHeight;
    this.viewportSize.set(size);
  }

  /**
   * Recomputes the rendered line range. Mirrors the CDK "fixed size"
   * strategy: only recompute once the scroll offset gets within
   * `minBufferPx` of the current range's edge, instead of on every pixel.
   *
   * All math here happens in *real* (uncompressed) content px, obtained by
   * dividing the raw DOM scroll offset/viewport size by `scaleFactor()`.
   * This is what makes the very last items reachable even when the total
   * content size has been compressed into a browser-safe DOM range: as
   * `domScrollOffset` sweeps its full (capped) range, `realOffset` still
   * sweeps the entire, real `naturalTotalSize()`.
   */
  private recomputeRange(force: boolean): void {
    const lineSize = this.lineSize();
    if (lineSize <= 0) {
      return;
    }

    const scale = this.scaleFactor();
    const realOffset = this.scrollOffset() / scale;
    const realViewportSize = this.viewportSize() / scale;

    const current = this.range();
    const min = this.minBufferPx();
    const max = this.maxBufferPx();

    const distanceToStart = realOffset - current.start * lineSize;
    const distanceToEnd = current.end * lineSize - (realOffset + realViewportSize);

    if (!force && distanceToStart >= min && distanceToEnd >= min) {
      return;
    }

    const bufferStart = Math.max(0, realOffset - max);
    const bufferEnd = realOffset + realViewportSize + max;

    const start = Math.max(0, Math.floor(bufferStart / lineSize));
    const end = Math.min(this.lineCount(), Math.ceil(bufferEnd / lineSize));
    const next: NgxVirtualScrollRange = { start, end };

    if (!rangesEqual(next, current)) {
      this.range.set(next);
      this.rangeChange.emit(next);
    }
  }
}
