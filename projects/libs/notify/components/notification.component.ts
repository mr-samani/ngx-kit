import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  DOCUMENT,
  inject,
  ElementRef,
  afterNextRender,
  signal,
  output,
  input,
  effect,
  viewChild,
} from '@angular/core';
import { INotifyEnd, NgxNotifyPayload } from '../models/notify.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule],
})
export class NgxNotificationComponent implements OnInit, OnDestroy {
  payload = input.required<NgxNotifyPayload>();
  @Input() containerClass = 'ngx-notify';

  bar = viewChild<ElementRef<HTMLElement>>('bar');
  onClose = output<INotifyEnd>();
  onFinish = output<INotifyEnd>();

  private _rafId = 0;
  private _duration = 0;
  private _remaining = 0;
  private _endTs = 0;
  private _paused = false;

  safeMessage: SafeHtml | string = '';
  safeDescription: SafeHtml | string = '';
  showClass = signal('');
  protected doc = inject(DOCUMENT);
  protected el = inject(ElementRef);
  protected sanitizer = inject(DomSanitizer);
  protected chdr = inject(ChangeDetectorRef);
  constructor() {
    afterNextRender(() => {
      this.showClass.set('ngx-show');
      this.chdr.detectChanges();
    });
    effect(() => {
      const payload = this.payload();

      // decide how to render message
      if (payload.options.allowHtml) {
        this.safeMessage = this.sanitizer.bypassSecurityTrustHtml(payload.message);
        this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(payload.description ?? '');
      } else {
        this.safeMessage = this.escapeHtml(payload.message);
        this.safeDescription = this.escapeHtml(payload.description);
      }
    });
    effect(() => {
      const timeout = this.payload().options.timeout ?? 0;
      this.startTimer(timeout);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.clearTimer();
  }

  // Public API to start timer (used by service when created)
  startTimer(ms: number) {
    this.clearTimer();

    if (!this._paused) {
      this._duration = ms;
    }
    this._remaining = ms;
    this._endTs = performance.now() + ms;

    const bar = this.bar()?.nativeElement;
    if (bar) {
      bar.style.transition = `transform ${ms}ms linear`;
      bar.style.transform = 'scaleX(1)';
    }

    this.animateProgress();
  }
  pauseTimer() {
    this._paused = true;
    cancelAnimationFrame(this._rafId);
    this._remaining = Math.max(0, this._endTs - performance.now());
    const bar = this.bar()?.nativeElement;
    if (bar) {
      const matrix = getComputedStyle(bar).transform;
      bar.style.transition = 'none';
      bar.style.transform = matrix;
    }
  }

  resumeTimer() {
    if (!this._paused || this._remaining <= 0) {
      return;
    }

    this._paused = false;

    this.startTimer(this._remaining);
  }

  private clearTimer() {
    cancelAnimationFrame(this._rafId);
    this._rafId = 0;
  }

  private animateProgress() {
    const update = () => {
      const remaining = Math.max(0, this._endTs - performance.now());
      if (remaining <= 0) {
        this.onFinish.emit({
          id: this.payload().id,
          el: this.el.nativeElement,
        });
        return;
      }

      this._rafId = requestAnimationFrame(update);
    };

    this._rafId = requestAnimationFrame(update);
  }

  close(ev?: Event) {
    if (ev) ev.stopPropagation();
    this.onClose.emit({ id: this.payload().id, el: this.el.nativeElement });
  }

  onMouseEnter() {
    if (this.payload().options.pauseOnHover) this.pauseTimer();
  }
  onMouseLeave() {
    if (this.payload().options.pauseOnHover) this.resumeTimer();
  }
  onTap() {
    if (this.payload().options.closeOnTap) this.close();
  }

  escapeHtml(input?: string) {
    if (!input) return '';
    const div = this.doc.createElement('div');
    div.appendChild(this.doc.createTextNode(input));
    return div.textContent;
  }

  ngOnDestroyCleanup() {
    this.clearTimer();
  }
}
