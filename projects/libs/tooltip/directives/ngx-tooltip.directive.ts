import {
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxTooltipPlacement } from '../types/NgxTooltipPlacement';
import { NgxTooltipTrigger } from '../types/NgxTooltipTrigger';

const TOOLTIP_CLASS = 'ngx-tooltip';
const VISIBLE_CLASS = 'ngx-tooltip-visible';

const VIEWPORT_PADDING = 8;
const DEFAULT_OFFSET = 8;
const SHOW_DELAY = 80;
const HIDE_DELAY = 40;

@Directive({
  selector: '[ngxTooltip]',
  standalone: true,
})
export class NgxTooltip implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly doc = inject(DOCUMENT);

  private readonly element = this.elementRef.nativeElement;

  private tooltip?: HTMLElement;

  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  private rafId = 0;
  private visible = false;
  private destroyed = false;

  private removeMouseEnter?: () => void;
  private removeMouseLeave?: () => void;
  private removeFocusIn?: () => void;
  private removeFocusOut?: () => void;
  private removeScroll?: () => void;
  private removeResize?: () => void;

  readonly tooltipText = input.required<string>({ alias: 'ngxTooltip' });
  readonly ngxTooltipUseOverlay = input<boolean>(true);

  readonly ngxTooltipPlacement = input<NgxTooltipPlacement>('bottom');

  readonly ngxTooltipOffset = input<number>(DEFAULT_OFFSET);

  readonly ngxTooltipDelay = input<number>(SHOW_DELAY);

  readonly ngxTooltipHideDelay = input<number>(HIDE_DELAY);

  readonly ngxTooltipAllowHtml = input<boolean>(false);

  readonly ngxTooltipTrigger = input<NgxTooltipTrigger>('hover');

  /**
   * If true, the tooltip automatically changes placement
   * when there is not enough room.
   */
  readonly ngxTooltipFlip = input<boolean>(true);

  /**
   * Keeps the tooltip inside the viewport.
   */
  readonly ngxTooltipShift = input<boolean>(true);

  constructor() {
    effect(() => {
      const trigger = this.ngxTooltipTrigger();
      this.bindEvents();
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    this.clearTimers();

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }

    this.removeListeners();

    this.tooltip?.remove();
    this.tooltip = undefined;
  }

  private bindEvents(): void {
    const trigger = this.ngxTooltipTrigger();
    this.removeMouseEnter?.();
    this.removeMouseLeave?.();
    this.removeFocusIn?.();
    this.removeFocusOut?.();

    if (trigger === 'hover' || trigger === 'hover-focus') {
      this.removeMouseEnter = this.renderer.listen(this.element, 'mouseenter', () =>
        this.scheduleShow(),
      );

      this.removeMouseLeave = this.renderer.listen(this.element, 'mouseleave', () =>
        this.scheduleHide(),
      );
    }

    if (trigger === 'focus' || trigger === 'hover-focus') {
      this.removeFocusIn = this.renderer.listen(this.element, 'focusin', () => this.scheduleShow());

      this.removeFocusOut = this.renderer.listen(this.element, 'focusout', () =>
        this.scheduleHide(),
      );
    }
  }

  private scheduleShow(): void {
    if (this.destroyed || !this.hasContent()) {
      return;
    }

    this.clearHideTimer();

    if (this.visible) {
      this.schedulePositionUpdate();
      return;
    }

    this.clearShowTimer();

    this.showTimer = setTimeout(
      () => {
        this.showTimer = undefined;

        if (!this.destroyed) {
          this.show();
        }
      },
      Math.max(0, this.ngxTooltipDelay()),
    );
  }

  private scheduleHide(): void {
    this.clearShowTimer();

    if (!this.visible) {
      return;
    }

    this.clearHideTimer();

    this.hideTimer = setTimeout(
      () => {
        this.hideTimer = undefined;

        if (!this.destroyed) {
          this.hide();
        }
      },
      Math.max(0, this.ngxTooltipHideDelay()),
    );
  }

  private show(): void {
    if (this.visible || this.destroyed || !this.hasContent()) {
      return;
    }

    const tooltip = this.getOrCreateTooltip();

    this.updateContent(tooltip);

    const doc = this.element.ownerDocument;

    if (!tooltip.isConnected) {
      doc.body.appendChild(tooltip);
    }

    this.applyDirection();

    this.visible = true;

    if (this.ngxTooltipUseOverlay()) {
      const popover = tooltip as HTMLElement & {
        showPopover?: () => void;
      };

      popover.showPopover?.();
    }

    tooltip.classList.add(VISIBLE_CLASS);

    this.schedulePositionUpdate();
    this.addViewportListeners();
  }

  private hide(): void {
    if (!this.visible) {
      return;
    }

    this.visible = false;

    this.clearShowTimer();

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }

    this.tooltip?.classList.remove(VISIBLE_CLASS);

    if (this.ngxTooltipUseOverlay() && this.tooltip?.matches(':popover-open')) {
      (
        this.tooltip as HTMLElement & {
          hidePopover(): void;
        }
      ).hidePopover();
    }

    // Tooltip should not stay in the DOM while hidden.
    this.tooltip?.remove();

    this.removeViewportListeners();
  }

  private getOrCreateTooltip(): HTMLElement {
    if (this.tooltip) {
      return this.tooltip;
    }

    const doc = this.element.ownerDocument;

    const tooltip = doc.createElement('div');

    tooltip.className = TOOLTIP_CLASS;
    tooltip.setAttribute('role', 'tooltip');

    if (this.ngxTooltipUseOverlay()) {
      tooltip.setAttribute('popover', 'manual');
    }

    tooltip.style.position = 'fixed';
    tooltip.style.left = '0';
    tooltip.style.top = '0';

    const content = doc.createElement('div');
    content.className = 'ngx-tooltip-content';

    tooltip.appendChild(content);

    this.tooltip = tooltip;

    return tooltip;
  }

  private updateContent(tooltip: HTMLElement): void {
    const content = tooltip.firstElementChild as HTMLElement | null;

    if (!content) {
      return;
    }

    const value = this.tooltipText() ?? '';
    if (this.ngxTooltipAllowHtml()) {
      content.innerHTML = this.sanitizer.sanitize(SecurityContext.STYLE, value) ?? '';
    } else {
      content.textContent = value;
    }
  }

  private applyDirection(): void {
    if (!this.tooltip) {
      return;
    }

    const direction = getComputedStyle(this.element).direction;

    this.tooltip.style.direction = direction;
  }

  private schedulePositionUpdate(): void {
    if (!this.visible || this.destroyed || !this.tooltip) {
      return;
    }

    if (this.rafId) {
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;

      if (!this.visible || this.destroyed) {
        return;
      }

      this.positionTooltip();
    });
  }

  private positionTooltip(): void {
    const tooltip = this.tooltip;

    if (!tooltip || !this.visible) {
      return;
    }

    const win = this.element.ownerDocument.defaultView;

    if (!win) {
      return;
    }

    const targetRect = this.element.getBoundingClientRect();

    if (targetRect.width === 0 || targetRect.height === 0 || !this.intersectsViewport(targetRect)) {
      tooltip.style.visibility = 'hidden';
      return;
    }

    tooltip.style.visibility = 'hidden';

    const tooltipRect = tooltip.getBoundingClientRect();

    const viewportWidth = win.innerWidth;
    const viewportHeight = win.innerHeight;

    const requestedPlacement = this.ngxTooltipPlacement();

    const placement = this.ngxTooltipFlip()
      ? this.findBestPlacement(
          requestedPlacement,
          targetRect,
          tooltipRect,
          viewportWidth,
          viewportHeight,
        )
      : requestedPlacement;

    let { left, top } = this.calculatePosition(
      placement,
      targetRect,
      tooltipRect,
      this.ngxTooltipOffset(),
    );

    if (this.ngxTooltipShift()) {
      const shifted = this.shiftIntoViewport(left, top, tooltipRect, viewportWidth, viewportHeight);

      left = shifted.left;
      top = shifted.top;
    }

    tooltip.dataset['placement'] = placement;

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;

    tooltip.style.visibility = 'visible';
  }

  private calculatePosition(
    placement: NgxTooltipPlacement,
    target: DOMRect,
    tooltip: DOMRect,
    offset: number,
  ): { left: number; top: number } {
    const [side, align] = this.parsePlacement(placement);

    let left: number = 0;
    let top: number = 0;

    switch (side) {
      case 'top':
        top = target.top - tooltip.height - offset;
        break;

      case 'bottom':
        top = target.bottom + offset;
        break;

      case 'left':
        left = target.left - tooltip.width - offset;
        break;

      case 'right':
        left = target.right + offset;
        break;
    }

    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          left = target.left;
          break;

        case 'end':
          left = target.right - tooltip.width;
          break;

        default:
          left = target.left + (target.width - tooltip.width) / 2;
      }
    } else {
      switch (align) {
        case 'start':
          top = target.top;
          break;

        case 'end':
          top = target.bottom - tooltip.height;
          break;

        default:
          top = target.top + (target.height - tooltip.height) / 2;
      }
    }

    return { left, top };
  }

  private findBestPlacement(
    requested: NgxTooltipPlacement,
    target: DOMRect,
    tooltip: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): NgxTooltipPlacement {
    const candidates = this.getPlacementCandidates(requested);

    for (const placement of candidates) {
      const position = this.calculatePosition(placement, target, tooltip, this.ngxTooltipOffset());

      if (this.fitsViewport(position.left, position.top, tooltip, viewportWidth, viewportHeight)) {
        return placement;
      }
    }

    return requested;
  }

  private getPlacementCandidates(placement: NgxTooltipPlacement): NgxTooltipPlacement[] {
    switch (placement) {
      case 'top':
        return ['top', 'bottom', 'right', 'left'];

      case 'bottom':
        return ['bottom', 'top', 'right', 'left'];

      case 'left':
        return ['left', 'right', 'top', 'bottom'];

      case 'right':
        return ['right', 'left', 'top', 'bottom'];
    }
  }

  private shiftIntoViewport(
    left: number,
    top: number,
    tooltip: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): { left: number; top: number } {
    const minLeft = VIEWPORT_PADDING;
    const maxLeft = viewportWidth - tooltip.width - VIEWPORT_PADDING;

    const minTop = VIEWPORT_PADDING;
    const maxTop = viewportHeight - tooltip.height - VIEWPORT_PADDING;

    left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));

    top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

    return { left, top };
  }

  private fitsViewport(
    left: number,
    top: number,
    tooltip: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): boolean {
    return (
      left >= VIEWPORT_PADDING &&
      top >= VIEWPORT_PADDING &&
      left + tooltip.width <= viewportWidth - VIEWPORT_PADDING &&
      top + tooltip.height <= viewportHeight - VIEWPORT_PADDING
    );
  }

  private intersectsViewport(rect: DOMRect): boolean {
    const win = this.element.ownerDocument.defaultView;

    if (!win) {
      return false;
    }

    return (
      rect.bottom > 0 && rect.right > 0 && rect.top < win.innerHeight && rect.left < win.innerWidth
    );
  }

  private parsePlacement(
    placement: NgxTooltipPlacement,
  ): ['top' | 'bottom' | 'left' | 'right', 'start' | 'end' | 'center'] {
    const [side, alignment] = placement.split('-') as [
      'top' | 'bottom' | 'left' | 'right',
      'start' | 'end' | undefined,
    ];

    return [side, alignment ?? 'center'];
  }

  private addViewportListeners(): void {
    if (this.removeScroll || this.removeResize) {
      return;
    }

    const win = this.element.ownerDocument.defaultView;

    if (!win) {
      return;
    }

    const onScroll = () => this.schedulePositionUpdate();
    const onResize = () => this.schedulePositionUpdate();

    win.addEventListener('scroll', onScroll, {
      passive: true,
    });

    win.addEventListener('resize', onResize, {
      passive: true,
    });

    this.removeScroll = () => {
      win.removeEventListener('scroll', onScroll);
    };

    this.removeResize = () => {
      win.removeEventListener('resize', onResize);
    };
  }

  private removeViewportListeners(): void {
    this.removeScroll?.();
    this.removeScroll = undefined;

    this.removeResize?.();
    this.removeResize = undefined;
  }

  private removeListeners(): void {
    this.removeMouseEnter?.();
    this.removeMouseLeave?.();
    this.removeFocusIn?.();
    this.removeFocusOut?.();

    this.removeMouseEnter = undefined;
    this.removeMouseLeave = undefined;
    this.removeFocusIn = undefined;
    this.removeFocusOut = undefined;
  }

  private hasContent(): boolean {
    return !!this.tooltipText()?.trim();
  }

  private clearTimers(): void {
    this.clearShowTimer();
    this.clearHideTimer();
  }

  private clearShowTimer(): void {
    if (this.showTimer !== undefined) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== undefined) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }
}
