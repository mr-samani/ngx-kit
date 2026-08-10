import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { startDragSession } from 'ngx-kit/shared';
import {
  NGX_IMAGE_VIEWER_DEFAULT_TOOLBAR,
  NgxImageViewerItem,
  NgxImageViewerToolbarConfig,
} from '../contracts/image-viewer-types';
import { downloadImage, printImage } from '../utils/download-print';
import {
  clamp,
  distanceBetweenTouches,
  midpointOfTouches,
  zoomAroundPoint,
} from '../utils/zoom-math';

/**
 * ویوئر حرفه‌ایِ تصویر: یه لیست تصویر می‌گیره، اولی رو نشون می‌ده، با
 * دکمه‌های چپ/راست (مثل کاروسل) بین‌شون می‌ره، و یه نوار ابزار کاملاً
 * قابل‌تنظیم (هر دکمه جدا فعال/غیرفعال می‌شه) داره: زوم این/اوت/ریست،
 * چرخش، دانلود، پرینت، تمام‌صفحه.
 *
 * تعامل‌ها:
 *  - اسکرول موس روی تصویر = زوم (نسبت به همون نقطه‌ی زیر cursor، نه مرکز)
 *  - دو انگشتی روی تاچ = پینچ زوم
 *  - وقتی زوم‌شده، درگ با موس یا تک‌انگشتی = پن
 *  - کیبورد: ← → برای قبلی/بعدی، +/- برای زوم، Esc برای closed
 *
 * چون wheel/touchmove باید preventDefault بشن (وگرنه صفحه اسکرول/زوم
 * می‌شه) و انگیولار این ایونت‌ها رو به‌صورت پیش‌فرض passive رجیستر می‌کنه
 * (که توش preventDefault اثر نداره)، این‌ها با addEventListener دستی و
 * {passive:false} وصل می‌شن، نه با بایندینگ تمپلیت.
 *
 * می‌تونه هم مستقیم توی صفحه جا بگیره، هم توسط مصرف‌کننده داخل
 * ngx-kit/dialog (یا هر overlay دیگه) قرار بگیره — خودش به هیچ‌کدوم وابسته
 * نیست، فقط با closed خروجی به بیرون خبر می‌ده که «ببندم».
 */
@Component({
  selector: 'ngx-image-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  host: { class: 'ngx-image-viewer-host', tabindex: '0' },
})
export class NgxImageViewerComponent {
  images = input.required<NgxImageViewerItem[]>();
  startIndex = input<number>(0);
  toolbar = input<NgxImageViewerToolbarConfig>({});
  minZoom = input<number>(1);
  maxZoom = input<number>(6);
  zoomStep = input<number>(0.4);

  indexChange = output<number>();
  closed = output<void>();

  protected readonly activeIndex = signal(0);
  protected readonly zoom = signal(1);
  protected readonly panX = signal(0);
  protected readonly panY = signal(0);
  protected readonly rotation = signal(0);

  protected readonly activeImage = computed<NgxImageViewerItem | undefined>(
    () => this.images()[this.activeIndex()],
  );

  protected readonly toolbarConfig = computed(() => ({
    ...NGX_IMAGE_VIEWER_DEFAULT_TOOLBAR,
    ...this.toolbar(),
  }));

  protected readonly isZoomed = computed(() => this.zoom() > 1);

  protected readonly stageTransform = computed(
    () =>
      `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()}) rotate(${this.rotation()}deg)`,
  );

  private readonly stageEl = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly hostElRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private pinchStartDistance = 0;
  private pinchStartZoom = 1;
  private stopPanDrag?: () => void;

  constructor() {
    this.activeIndex.set(this.startIndex());

    // wheel/touch با addEventListener دستی + passive:false وصل می‌شن (دلیلش
    // بالای کلاس توضیح داده شده)؛ effect به‌صورت خودکار وقتی stageEl از
    // undefined به یه ElementRef واقعی تغییر کنه (یعنی بعد از اولین رندر)
    // دوباره اجرا می‌شه، پس نیازی به ngAfterViewInit نیست.
    effect((onCleanup) => {
      const stage = this.stageEl()?.nativeElement;
      if (!stage) return;

      const onWheel = (ev: WheelEvent) => {
        ev.preventDefault();
        const rect = stage.getBoundingClientRect();
        this.applyZoomAt(
          this.zoom() + (ev.deltaY < 0 ? 1 : -1) * this.zoomStep(),
          ev.clientX - rect.left,
          ev.clientY - rect.top,
          rect.width,
          rect.height,
        );
      };

      const onTouchStart = (ev: TouchEvent) => {
        if (ev.touches.length === 2) {
          this.stopPanDrag?.();
          this.pinchStartDistance = distanceBetweenTouches(ev.touches[0], ev.touches[1]);
          this.pinchStartZoom = this.zoom();
        } else if (ev.touches.length === 1 && this.isZoomed()) {
          this.beginPanDrag(ev);
        }
      };

      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches.length === 2 && this.pinchStartDistance > 0) {
          ev.preventDefault();
          const dist = distanceBetweenTouches(ev.touches[0], ev.touches[1]);
          const newZoom = (dist / this.pinchStartDistance) * this.pinchStartZoom;
          const rect = stage.getBoundingClientRect();
          const mid = midpointOfTouches(ev.touches[0], ev.touches[1]);
          this.applyZoomAt(newZoom, mid.x - rect.left, mid.y - rect.top, rect.width, rect.height);
        }
      };

      const onTouchEnd = () => {
        this.pinchStartDistance = 0;
      };

      stage.addEventListener('wheel', onWheel, { passive: false });
      stage.addEventListener('touchstart', onTouchStart, { passive: false });
      stage.addEventListener('touchmove', onTouchMove, { passive: false });
      stage.addEventListener('touchend', onTouchEnd);
      stage.addEventListener('touchcancel', onTouchEnd);

      onCleanup(() => {
        stage.removeEventListener('wheel', onWheel);
        stage.removeEventListener('touchstart', onTouchStart);
        stage.removeEventListener('touchmove', onTouchMove);
        stage.removeEventListener('touchend', onTouchEnd);
        stage.removeEventListener('touchcancel', onTouchEnd);
      });
    });

    this.destroyRef.onDestroy(() => this.stopPanDrag?.());
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowLeft') this.prev();
    else if (ev.key === 'ArrowRight') this.next();
    else if (ev.key === '+' || ev.key === '=') this.zoomIn();
    else if (ev.key === '-') this.zoomOut();
    else if (ev.key === 'Escape') this.closed.emit();
    else return;
    ev.preventDefault();
  }

  protected next(): void {
    const len = this.images().length;
    if (len) this.goTo((this.activeIndex() + 1) % len);
  }

  protected prev(): void {
    const len = this.images().length;
    if (len) this.goTo((this.activeIndex() - 1 + len) % len);
  }

  protected goTo(index: number): void {
    this.activeIndex.set(index);
    this.resetView();
    this.indexChange.emit(index);
  }

  protected zoomIn(): void {
    this.setZoomAtCenter(this.zoom() + this.zoomStep());
  }

  protected zoomOut(): void {
    this.setZoomAtCenter(this.zoom() - this.zoomStep());
  }

  protected resetView(): void {
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
    this.rotation.set(0);
  }

  protected rotateLeft(): void {
    this.rotation.update((r) => r - 90);
  }

  protected rotateRight(): void {
    this.rotation.update((r) => r + 90);
  }

  protected async download(): Promise<void> {
    const img = this.activeImage();
    if (img) await downloadImage(img.src, img.downloadFileName);
  }

  protected print(): void {
    const img = this.activeImage();
    if (img) printImage(img.src);
  }

  protected toggleFullscreen(): void {
    const el = this.hostElRef.nativeElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  protected close(): void {
    this.closed.emit();
  }

  protected onPanPointerDown(ev: MouseEvent): void {
    if (!this.isZoomed()) return;
    this.beginPanDrag(ev);
  }

  private beginPanDrag(ev: MouseEvent | TouchEvent): void {
    ev.preventDefault();
    const startPanX = this.panX();
    const startPanY = this.panY();
    const startX = this.clientXOf(ev);
    const startY = this.clientYOf(ev);
    this.stopPanDrag?.();
    this.stopPanDrag = startDragSession({
      onMove: (moveEv) => {
        this.panX.set(startPanX + (this.clientXOf(moveEv) - startX));
        this.panY.set(startPanY + (this.clientYOf(moveEv) - startY));
      },
      onEnd: () => {
        this.stopPanDrag = undefined;
      },
    });
  }

  private setZoomAtCenter(newZoom: number): void {
    const stage = this.stageEl()?.nativeElement;
    if (!stage) {
      this.zoom.set(clamp(newZoom, this.minZoom(), this.maxZoom()));
      return;
    }
    const rect = stage.getBoundingClientRect();
    this.applyZoomAt(newZoom, rect.width / 2, rect.height / 2, rect.width, rect.height);
  }

  private applyZoomAt(
    rawZoom: number,
    x: number,
    y: number,
    containerWidth: number,
    containerHeight: number,
  ): void {
    const newZoom = clamp(rawZoom, this.minZoom(), this.maxZoom());
    if (newZoom === this.zoom()) return;
    const result = zoomAroundPoint(
      { zoom: this.zoom(), panX: this.panX(), panY: this.panY() },
      newZoom,
      x,
      y,
      containerWidth,
      containerHeight,
    );
    this.zoom.set(result.zoom);
    this.panX.set(result.panX);
    this.panY.set(result.panY);
  }

  private clientXOf(ev: MouseEvent | TouchEvent): number {
    return 'touches' in ev
      ? (ev.touches[0]?.clientX ?? ev.changedTouches[0]?.clientX ?? 0)
      : ev.clientX;
  }

  private clientYOf(ev: MouseEvent | TouchEvent): number {
    return 'touches' in ev
      ? (ev.touches[0]?.clientY ?? ev.changedTouches[0]?.clientY ?? 0)
      : ev.clientY;
  }
}
