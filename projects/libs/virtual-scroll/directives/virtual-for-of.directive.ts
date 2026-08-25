import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgxVirtualScrollViewportComponent } from '../components/virtual-scroll-viewport.component';
import { NgxVirtualScrollRange } from '../types/virtual-scroll-range.interface';
import { NgxVirtualForOfContext } from '../types/virtual-scroll-item-context.interface';

/**
 * معادل ویرچوال‌شده‌ی *ngFor؛ باید داخل <ngx-virtual-scroll-viewport> استفاده شود.
 *
 * @example
 * <ngx-virtual-scroll-viewport [itemSize]="52">
 *   <ng-container *ngxVirtualFor="let row of rows; trackBy: trackByFn; let i = index">
 *     <tr>...</tr>
 *   </ng-container>
 * </ngx-virtual-scroll-viewport>
 */
@Directive({
  selector: '[ngxVirtualFor][ngxVirtualForOf]',
  standalone: true,
})
export class NgxVirtualForOfDirective<T> implements OnInit, OnChanges, OnDestroy {
  @Input() ngxVirtualForOf: readonly T[] | null = [];
  @Input() ngxVirtualForTrackBy?: TrackByFunction<T>;

  private data: readonly T[] = [];
  private views = new Map<number, EmbeddedViewRef<NgxVirtualForOfContext<T>>>();
  private rangeSub?: Subscription;

  // عمداً از @Host() استفاده نشده: چون این دایرکتیو داخل محتوای projected شده
  // (ng-content) در viewport استفاده می‌شود، تزریق معمولی (نه @Host) لازم است تا
  // زنجیره‌ی NodeInjector از مرز projection عبور کند و NgxVirtualScrollViewportComponent
  // پیدا شود؛ دقیقاً همان الگویی که CdkVirtualForOf در Angular CDK استفاده می‌کند.
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<NgxVirtualForOfContext<T>>,
    private viewport: NgxVirtualScrollViewportComponent
  ) {}

  ngOnInit(): void {
    this.rangeSub = this.viewport.renderedRangeStream$.subscribe((range) => this.renderRange(range));
  }

  ngOnDestroy(): void {
    this.rangeSub?.unsubscribe();
    this.viewContainerRef.clear();
    this.views.clear();
  }

  ngOnChanges(): void {
    this.setData(this.ngxVirtualForOf ?? []);
  }

  private setData(data: readonly T[]): void {
    this.data = data;
    this.viewport.setDataLength(data.length);
    // بازه‌ی فعلی را با دیتای جدید دوباره رندر کن (طول ممکن است کم/زیاد شده باشد)
    this.renderRange(this.viewport.getRenderedRange());
  }

  private renderRange(range: NgxVirtualScrollRange): void {
    const data = this.data;
    const count = data.length;
    const start = Math.max(0, Math.min(range.start, count));
    const end = Math.max(start, Math.min(range.end, count));

    // ۱) حذف ویوهایی که دیگر داخل بازه نیستند
    for (const index of Array.from(this.views.keys())) {
      if (index < start || index >= end) {
        const view = this.views.get(index)!;
        const viewIndex = this.viewContainerRef.indexOf(view);
        if (viewIndex !== -1) {
          this.viewContainerRef.remove(viewIndex);
        }
        this.views.delete(index);
      }
    }

    // ۲) ساخت/به‌روزرسانی/جابه‌جایی ویوهای داخل بازه (به ترتیب صعودی)
    let insertPos = 0;
    for (let index = start; index < end; index++, insertPos++) {
      const item = data[index];
      let view = this.views.get(index);

      if (!view) {
        const context = this.createContext(item, index, count);
        view = this.viewContainerRef.createEmbeddedView(this.templateRef, context, insertPos);
        this.views.set(index, view);
        continue;
      }

      const currentPos = this.viewContainerRef.indexOf(view);
      if (currentPos !== insertPos) {
        this.viewContainerRef.move(view, insertPos);
      }
      this.updateContext(view.context, item, index, count);
      view.detectChanges();
    }
  }

  private createContext(item: T, index: number, count: number): NgxVirtualForOfContext<T> {
    const context = {} as NgxVirtualForOfContext<T>;
    this.updateContext(context, item, index, count);
    return context;
  }

  private updateContext(context: NgxVirtualForOfContext<T>, item: T, index: number, count: number): void {
    context.$implicit = item;
    context.ngxVirtualForOf = this.data;
    context.index = index;
    context.count = count;
    context.first = index === 0;
    context.last = index === count - 1;
    context.even = index % 2 === 0;
    context.odd = !context.even;
  }

  /** برای type-checking در تمپلیت (ngTemplateContextGuard) */
  static ngTemplateContextGuard<T>(
    dir: NgxVirtualForOfDirective<T>,
    ctx: unknown
  ): ctx is NgxVirtualForOfContext<T> {
    return true;
  }
}
