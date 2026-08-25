import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';

import { NgxVirtualScrollOrientation } from '../types/virtual-scroll-orientation.type';
import { NgxVirtualScrollRange } from '../types/virtual-scroll-range.interface';
import { NGX_VIRTUAL_SCROLL_STRATEGY, NgxVirtualScrollViewportRef } from '../tokens/virtual-scroll-viewport-ref';
import { NgxVirtualScrollStrategy } from '../strategies/virtual-scroll-strategy';
import { NgxFixedSizeVirtualScrollStrategy } from '../strategies/fixed-size-virtual-scroll-strategy';

@Component({
  selector: 'ngx-virtual-scroll-viewport, ngx-virtual-scroll',
  standalone: true,
  templateUrl: './virtual-scroll-viewport.component.html',
  styleUrls: ['./virtual-scroll-viewport.component.scss'],
  exportAs: 'ngxVirtualScrollViewport',
  changeDetection: ChangeDetectionStrategy.OnPush,
 // encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngx-virtual-scroll-viewport-host',
  },
})
export class NgxVirtualScrollViewportComponent
  implements NgxVirtualScrollViewportRef, AfterViewInit, OnChanges, OnDestroy
{
  /** جهت اسکرول: عمودی (پیش‌فرض) یا افقی */
  @Input() orientation: NgxVirtualScrollOrientation = 'vertical';

  /** اندازه‌ی ثابت هر آیتم به px (فقط برای استراتژی پیش‌فرض fixed-size) */
  @Input() itemSize = 50;

  /** حداقل بافر (px) قبل از این‌که مجبور به محاسبه‌ی دوباره‌ی بازه شویم */
  @Input() minBufferPx = 100;

  /** حداکثر بافر (px) که خارج از دید کاربر رندر می‌شود */
  @Input() maxBufferPx = 200;

  @Output() scrolledIndexChange = new EventEmitter<number>();
  @Output() renderedRangeChange = new EventEmitter<NgxVirtualScrollRange>();

  @ViewChild('scrollable', { static: true }) private scrollableRef!: ElementRef<HTMLElement>;
  @ViewChild('spacer', { static: true }) private spacerRef!: ElementRef<HTMLElement>;
  @ViewChild('contentWrapper', { static: true }) private contentWrapperRef!: ElementRef<HTMLElement>;

  /** stream داخلی که دایرکتیو ngxVirtualFor به آن گوش می‌دهد */
  readonly renderedRangeStream$ = new Subject<NgxVirtualScrollRange>();

  private dataLength = 0;
  private lastRenderedRange: NgxVirtualScrollRange = { start: 0, end: 0 };

  private resizeObserver?: ResizeObserver;
  private scrollListenerCleanup?: () => void;
  private scrollTicking = false;

  private readonly strategy: NgxVirtualScrollStrategy;

  constructor(
    private zone: NgZone,
    @Optional() @Inject(NGX_VIRTUAL_SCROLL_STRATEGY) injectedStrategy: NgxVirtualScrollStrategy | null
  ) {
    this.strategy =
      injectedStrategy ?? new NgxFixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);
  }

  ngAfterViewInit(): void {
    this.strategy.attach(this);

    this.zone.runOutsideAngular(() => {
      const el = this.scrollableRef.nativeElement;
      const onScroll = () => this.handleScroll();
      el.addEventListener('scroll', onScroll, { passive: true });
      this.scrollListenerCleanup = () => el.removeEventListener('scroll', onScroll);

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.zone.run(() => this.checkViewportSize()));
        this.resizeObserver.observe(el);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.strategy instanceof NgxFixedSizeVirtualScrollStrategy) {
      if (changes['itemSize'] || changes['minBufferPx'] || changes['maxBufferPx']) {
        this.strategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
      }
    }
    if (changes['orientation'] && !changes['orientation'].firstChange) {
      this.checkViewportSize();
    }
  }

  ngOnDestroy(): void {
    this.strategy.detach();
    this.scrollListenerCleanup?.();
    this.resizeObserver?.disconnect();
    this.renderedRangeStream$.complete();
  }

  // ---------- NgxVirtualScrollViewportRef ----------

  getViewportSize(): number {
    const el = this.scrollableRef?.nativeElement;
    if (!el) return 0;
    return this.orientation === 'horizontal' ? el.clientWidth : el.clientHeight;
  }

  getDataLength(): number {
    return this.dataLength;
  }

  getScrollOffset(): number {
    const el = this.scrollableRef?.nativeElement;
    if (!el) return 0;
    return this.orientation === 'horizontal' ? el.scrollLeft : el.scrollTop;
  }

  setTotalContentSize(size: number): void {
    const spacer = this.spacerRef?.nativeElement;
    if (!spacer) return;
    if (this.orientation === 'horizontal') {
      spacer.style.width = `${size}px`;
      spacer.style.height = '1px';
    } else {
      spacer.style.height = `${size}px`;
      spacer.style.width = '1px';
    }
  }

  setRenderedRange(range: NgxVirtualScrollRange): void {
    this.lastRenderedRange = range;
    this.renderedRangeStream$.next(range);
    this.zone.run(() => this.renderedRangeChange.emit(range));
  }

  setRenderedContentOffset(offset: number): void {
    const wrapper = this.contentWrapperRef?.nativeElement;
    if (!wrapper) return;
    wrapper.style.transform =
      this.orientation === 'horizontal' ? `translateX(${offset}px)` : `translateY(${offset}px)`;
  }

  // ---------- API عمومی ----------

  /** طول دیتاسورس را به viewport معرفی می‌کند (توسط دایرکتیو ngxVirtualFor صدا زده می‌شود) */
  setDataLength(length: number): void {
    if (this.dataLength === length) return;
    this.dataLength = length;
    this.strategy.onDataLengthChanged();
  }

  /** بازه‌ی فعلی رندر شده را برمی‌گرداند */
  getRenderedRange(): NgxVirtualScrollRange {
    return this.lastRenderedRange;
  }

  /** اسکرول برنامه‌ای به یک ایندکس مشخص */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    this.scrollToOffset(this.strategy.getOffsetForIndex(index), behavior);
  }

  /** اسکرول برنامه‌ای به یک آفست پیکسلی مشخص */
  scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
    const el = this.scrollableRef?.nativeElement;
    if (!el) return;
    const options: ScrollToOptions =
      this.orientation === 'horizontal' ? { left: offset, behavior } : { top: offset, behavior };
    el.scrollTo(options);
  }

  /** اندازه‌گیری دستی viewport (وقتی ResizeObserver در دسترس نیست یا layout بیرون تغییر کرده) */
  checkViewportSize(): void {
    this.strategy.onViewportSizeChanged();
  }

  private handleScroll(): void {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.strategy.onScrolled();
      this.emitScrolledIndex();
      this.scrollTicking = false;
    });
  }

  private emitScrolledIndex(): void {
    if (this.itemSize <= 0) return;
    const index = Math.floor(this.getScrollOffset() / this.itemSize);
    this.zone.run(() => this.scrolledIndexChange.emit(index));
  }
}
