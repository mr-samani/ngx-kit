import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { startDragSession } from 'ngx-kit/shared';
import { NgxGalleryImage, NgxGalleryTheme } from '../contracts/gallery-image';

/**
 * گالریِ نمایش تصاویر با سه تم: grid (چیدمانِ کاشی + کلیک برای لایت‌باکس)،
 * carousel (اسلایدر افقی با پیمایشِ swipe) و slideshow (نمایش تک‌تصویرِ
 * خودکار + نوار تصاویر کوچک).
 *
 * برای swipe در حالت carousel/slideshow از startDragSession استفاده شده —
 * همون ابزار مشترکی که برای رفع مشکل پرفورمنسِ کامپوننت‌های درگ‌محور دیگه
 * (saturation/slider/range-slider/box-shadow) ساخته شد؛ اینجا هم چون
 * listenerهای document فقط حین یه swipe واقعی وصل می‌شن، به‌جای برای کل عمر
 * کامپوننت، مشکلی از اون جنس پیش نمیاد.
 *
 * لایت‌باکس با <dialog> بومی پیاده شده (بدون وابستگی به ngx-kit/dialog)، تا
 * این lib کاملاً مستقل و سبک بمونه.
 */
@Component({
  selector: 'ngx-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  host: { class: 'ngx-gallery-host' },
})
export class NgxGalleryComponent {
  images = input.required<NgxGalleryImage[]>();
  theme = input<NgxGalleryTheme>('grid');
  columns = input<number>(3);
  autoplay = input<boolean>(false);
  autoplayInterval = input<number>(4000);

  activeIndexChange = output<number>();

  protected readonly activeIndex = signal(0);
  protected readonly lightboxOpen = signal(false);
  protected readonly lightboxIndex = signal(0);

  private readonly trackEl = viewChild<ElementRef<HTMLElement>>('track');
  private readonly lightboxEl = viewChild<ElementRef<HTMLDialogElement>>('lightboxDialog');
  private readonly destroyRef = inject(DestroyRef);

  private autoplayTimer?: ReturnType<typeof setInterval>;
  private stopDrag?: () => void;
  private dragStartX = 0;
  private dragDeltaX = signal(0);

  protected readonly trackStyle = computed(() => {
    const idx = this.activeIndex();
    const drag = this.dragDeltaX();
    return { transform: `translateX(calc(${-idx * 100}% + ${drag}px))` };
  });

  constructor() {
    effect((onCleanup) => {
      const shouldPlay = this.autoplay() && this.theme() !== 'grid' && this.images().length > 1;
      if (shouldPlay) {
        this.autoplayTimer = setInterval(() => this.next(), this.autoplayInterval());
      }
      onCleanup(() => {
        if (this.autoplayTimer) clearInterval(this.autoplayTimer);
      });
    });

    this.destroyRef.onDestroy(() => this.stopDrag?.());
  }

  protected goTo(index: number): void {
    const len = this.images().length;
    if (!len) return;
    const clamped = ((index % len) + len) % len;
    this.activeIndex.set(clamped);
    this.activeIndexChange.emit(clamped);
  }

  protected next(): void {
    this.goTo(this.activeIndex() + 1);
  }

  protected prev(): void {
    this.goTo(this.activeIndex() - 1);
  }

  // ---------- swipe برای carousel/slideshow ----------
  protected onTrackDragStart(ev: MouseEvent | TouchEvent): void {
    if (this.images().length < 2) return;
    ev.preventDefault();
    this.dragStartX = this.clientXOf(ev);
    this.stopDrag?.();
    this.stopDrag = startDragSession({
      onMove: (moveEv) => {
        this.dragDeltaX.set(this.clientXOf(moveEv) - this.dragStartX);
      },
      onEnd: () => {
        const trackWidth = this.trackEl()?.nativeElement.offsetWidth || 1;
        const delta = this.dragDeltaX();
        const threshold = trackWidth * 0.18;
        if (delta > threshold) this.prev();
        else if (delta < -threshold) this.next();
        this.dragDeltaX.set(0);
        this.stopDrag = undefined;
      },
    });
  }

  private clientXOf(ev: MouseEvent | TouchEvent): number {
    return 'touches' in ev ? (ev.touches[0]?.clientX ?? ev.changedTouches[0]?.clientX ?? 0) : ev.clientX;
  }

  // ---------- لایت‌باکس ----------
  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    queueMicrotask(() => this.lightboxEl()?.nativeElement.showModal());
  }

  protected closeLightbox(): void {
    this.lightboxEl()?.nativeElement.close();
    this.lightboxOpen.set(false);
  }

  protected lightboxNext(): void {
    const len = this.images().length;
    this.lightboxIndex.update((i) => (i + 1) % len);
  }

  protected lightboxPrev(): void {
    const len = this.images().length;
    this.lightboxIndex.update((i) => (i - 1 + len) % len);
  }

  protected onLightboxKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowLeft') this.lightboxPrev();
    if (ev.key === 'ArrowRight') this.lightboxNext();
  }
}
