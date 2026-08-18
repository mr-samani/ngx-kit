import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  HostListener,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { DirectionService, startDragSession } from 'ngx-kit/shared';
import {
  NgxDrawerContentBehavior,
  NgxDrawerEffect,
  NgxDrawerSide,
} from '../contracts/drawer-menu-types';

/**
 * درور منو (side drawer) با ۶ جلوه‌ی بازوبسته‌شدنِ متفاوت (از ساده تا
 * سه‌بعدی/ژله‌ای) و ۳ رفتار برای محتوای صفحه (overlay/push/reveal) —
 * دقیقاً مدل کتابخونه‌های حرفه‌ای مثل react-burger-menu یا Ionic Menu، ولی
 * signal-based و بدون هیچ وابستگی خارجی.
 *
 * نکات معماری:
 *  - از 'start'/'end' منطقی استفاده می‌کنه، پس با CSS logical properties
 *    زیر RTL خودکار برعکس می‌شه؛ فقط ریاضیِ درگ (که برخلاف CSS جهت فیزیکیِ
 *    واقعی لازم داره) از DirectionService مشترک استفاده می‌کنه.
 *  - وضعیت باز/بسته با model() دوطرفه‌ست، پس هم با [(open)] قابل کنترله و
 *    هم می‌تونه به‌صورت خودکار و زنده با عرض صفحه هماهنگ بشه (respondToViewport)
 *    — یعنی رد شدن از breakpoint (نه فقط بار اول لود) می‌تونه خودکار باز/بسته‌ش کنه.
 *  - افکت‌های jelly/pull با keyframe سه‌مرحله‌ای (overshoot → نوسان → استقرار)
 *    پیاده شدن، نه فقط یه transition ساده.
 */
@Component({
  selector: 'ngx-drawer-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  host: { class: 'ngx-drawer-menu-host' },
})
export class NgxDrawerMenuComponent {
  side = input<NgxDrawerSide>('start');
  effect = input<NgxDrawerEffect>('slide');
  contentBehavior = input<NgxDrawerContentBehavior>('overlay');
  width = input<number>(280);
  swipeEdgeSize = input<number>(24);
  curtainStrips = input<number>(7);
  backdropClose = input<boolean>(true);
  swipeEnabled = input<boolean>(true);

  /** اگه true باشه، رد شدن از mobileBreakpoint به‌صورت زنده open رو با openOnDesktop/openOnMobile هماهنگ می‌کنه */
  respondToViewport = input<boolean>(true);
  openOnDesktop = input<boolean>(true);
  openOnMobile = input<boolean>(false);
  mobileBreakpoint = input<number>(768);

  /** state دوطرفه‌ی باز/بسته؛ با [(open)] قابل bind هست */
  open = model<boolean>(false);

  private readonly directionService = inject(DirectionService);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** فقط حین یه درگِ واقعی مقدار داره؛ null یعنی از روی open() تصمیم بگیر */
  protected readonly dragRatio = signal<number | null>(null);
  protected readonly isDragging = computed(() => this.dragRatio() !== null);
  protected readonly visualOpen = computed(() => this.dragRatio() ?? (this.open() ? 1 : 0));
  protected readonly strips = computed(() =>
    Array.from({ length: this.curtainStrips() }, (_, i) => i),
  );

  /**
   * +۱ یعنی این پنل فیزیکاً روی لبه‌ی چپِ صفحه‌ست، -۱ یعنی لبه‌ی راست —
   * برای transform:translateX() محتوای اصلی (که برخلاف inset-inline، به
   * dir=rtl خودکار واکنش نشون نمی‌ده) لازمه. reactive هست چون هم به side()
   * و هم به جهتِ زنده‌ی صفحه (directionService.isRtl()) وابسته‌ست.
   */
  protected readonly pushDirSign = computed(() => (this.isPhysicalLeftEdge() ? 1 : -1));

  /** برای افکت‌های keyframe‌محور (jelly/pull) — فقط لحظه‌ی رهاشدن (نه حین درگ زنده) پخش می‌شه */
  protected readonly playEffectClass = signal(false);

  private stopDrag?: () => void;
  private dragStartX = 0;
  private dragStartRatio = 0;
  private prevOpen = false;

  constructor() {
    // قفل اسکرول پس‌زمینه حین باز بودن پنل (فقط در حالت overlay واقعاً لازمه،
    // ولی در push/reveal هم بی‌ضرره و تجربه‌ی بهتری می‌ده)
    effect((onCleanup) => {
      if (this.open() && this.contentBehavior() === 'overlay') {
        const prevOverflow = this.doc.body.style.overflow;
        this.doc.body.style.overflow = 'hidden';
        onCleanup(() => {
          this.doc.body.style.overflow = prevOverflow;
        });
      }
    });

    // پخش انیمیشن keyframe‌محور فقط لحظه‌ای که open() واقعاً عوض می‌شه (نه هر CD)
    effect(() => {
      const isOpen = this.open();
      if (isOpen !== this.prevOpen) {
        this.prevOpen = isOpen;
        this.playEffectClass.set(true);
        const id = setTimeout(() => this.playEffectClass.set(false), 700);
        // پاک‌سازی در صورتی که کامپوننت زودتر destroy بشه
        this.destroyRef.onDestroy(() => clearTimeout(id));
      }
    });

    this.destroyRef.onDestroy(() => this.stopDrag?.());

    // هماهنگیِ زنده با breakpoint
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(min-width: ${this.mobileBreakpoint()}px)`);
      const applyForCurrentViewport = (isDesktop: boolean) => {
        if (this.respondToViewport()) {
          this.open.set(isDesktop ? this.openOnDesktop() : this.openOnMobile());
        }
      };
      applyForCurrentViewport(mql.matches);
      const handler = (e: MediaQueryListEvent) => applyForCurrentViewport(e.matches);
      mql.addEventListener('change', handler);
      this.destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.open.set(false);
  }

  protected closeFromBackdrop(): void {
    if (this.backdropClose()) this.open.set(false);
  }

  toggle(): void {
    this.open.update((o) => !o);
  }

  /** true یعنی این پنل فیزیکاً روی لبه‌ی چپِ صفحه‌ست (صرف‌نظر از start/end منطقی) */
  private isPhysicalLeftEdge(): boolean {
    const isRtl = this.directionService.isRtl();
    return this.side() === 'start' ? !isRtl : isRtl;
  }

  protected stripDelay(index: number): string {
    const count = this.curtainStrips();
    const order = this.open() ? index : count - 1 - index;
    return `${order * 28}ms`;
  }

  // ---------- درگ (هم برای باز کردن از لبه، هم بستن با کشیدنِ پنل) ----------
  protected onEdgeDragStart(ev: MouseEvent | TouchEvent): void {
    if (!this.swipeEnabled() || this.open()) return;
    this.beginDrag(ev, 0);
  }

  protected onPanelDragStart(ev: MouseEvent | TouchEvent): void {
    if (!this.open()) return;
    this.beginDrag(ev, 1);
  }

  private beginDrag(ev: MouseEvent | TouchEvent, startRatio: number): void {
    ev.preventDefault();
    this.dragStartX = this.clientXOf(ev);
    this.dragStartRatio = startRatio;
    this.dragRatio.set(startRatio);
    this.stopDrag?.();
    this.stopDrag = startDragSession({
      onMove: (moveEv) => {
        const dx = this.clientXOf(moveEv) - this.dragStartX;
        const opensToward = this.isPhysicalLeftEdge() ? 1 : -1;
        const signedRatio = (dx * opensToward) / this.width();
        const ratio = Math.min(1, Math.max(0, this.dragStartRatio + signedRatio));
        this.dragRatio.set(ratio);
      },
      onEnd: () => {
        const ratio = this.dragRatio() ?? this.dragStartRatio;
        this.open.set(ratio > 0.4);
        this.dragRatio.set(null);
        this.stopDrag = undefined;
      },
    });
  }

  private clientXOf(ev: MouseEvent | TouchEvent): number {
    return 'touches' in ev
      ? (ev.touches[0]?.clientX ?? ev.changedTouches[0]?.clientX ?? 0)
      : ev.clientX;
  }
}
