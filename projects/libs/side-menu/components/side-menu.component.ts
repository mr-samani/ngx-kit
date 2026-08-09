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
import { NgxSideMenuSide } from '../contracts/side-menu-types';

/**
 * ساید-منویی شبیه Drawer فلاتر: با کشیدن از لبه‌ی صفحه باز می‌شه (یا با
 * toggle برنامه‌نویسی)، و به‌جای اسلایدِ ساده، با یه افکت «پرده‌ای» چندنواری
 * باز/بسته می‌شه — پنل به چند نوارِ عمودی تقسیم می‌شه که هرکدوم با تأخیرِ
 * کمی نسبت به قبلی، جدا حرکت می‌کنن (حس باز شدنِ پارچه/پرده).
 *
 * از 'start'/'end' منطقی استفاده می‌کنه، پس همه‌جا با CSS logical properties
 * پیاده شده و به‌صورت خودکار زیر RTL برعکس می‌شه؛ برای محاسبه‌ی ریاضیِ درگ
 * (که برخلاف CSS، جهت فیزیکیِ واقعی رو لازم داره) از DirectionService سیگنال‌
 * محورِ ngx-kit/shared استفاده می‌شه.
 */
@Component({
  selector: 'ngx-side-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  host: { class: 'ngx-side-menu-host' },
})
export class NgxSideMenuComponent {
  side = input<NgxSideMenuSide>('start');
  width = input<number>(280);
  /** پهنای ناحیه‌ی نامرئیِ لبه‌ی صفحه که کشیدن ازش باعث باز شدن می‌شه */
  swipeEdgeSize = input<number>(24);
  curtainStrips = input<number>(7);
  backdropClose = input<boolean>(true);
  swipeEnabled = input<boolean>(true);

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

  private stopDrag?: () => void;
  private dragStartX = 0;
  private dragStartRatio = 0;

  constructor() {
    // قفل اسکرول پس‌زمینه حین باز بودن پنل — با onCleanup هم موقع بسته‌شدن
    // و هم موقع destroy کامپوننت (که راحت فراموش می‌شه) برگردونده می‌شه.
    effect((onCleanup) => {
      if (this.open()) {
        const prevOverflow = this.doc.body.style.overflow;
        this.doc.body.style.overflow = 'hidden';
        onCleanup(() => {
          this.doc.body.style.overflow = prevOverflow;
        });
      }
    });

    this.destroyRef.onDestroy(() => this.stopDrag?.());
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.open.set(false);
  }

  protected closeFromBackdrop(): void {
    if (this.backdropClose()) this.open.set(false);
  }

  /** true یعنی این پنل فیزیکاً روی لبه‌ی چپِ صفحه‌ست (صرف‌نظر از start/end منطقی) */
  private isPhysicalLeftEdge(): boolean {
    const isRtl = this.directionService.isRtl();
    return this.side() === 'start' ? !isRtl : isRtl;
  }

  protected stripDelay(index: number): string {
    const count = this.curtainStrips();
    // وقتی باز می‌شه، نوارِ نزدیک به لبه زودتر حرکت می‌کنه؛ وقتی بسته می‌شه برعکس —
    // دقیقاً همون حسی که یه پرده‌ی واقعی موقع کشیده‌شدن داره.
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
