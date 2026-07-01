import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  DOCUMENT,
  inject,
  ElementRef,
  Renderer2,
  afterNextRender,
  signal,
  output,
} from '@angular/core';
import { INotifyEnd, NgxNotifyPayload } from '../models/notify.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule],
})
export class NgxPgNotificationComponent implements OnInit, OnDestroy {
  @Input() payload!: NgxNotifyPayload;
  @Input() containerClass = 'ngx-notify';

  onClose = output<INotifyEnd>();
  onFinish = output<INotifyEnd>();

  private _timeoutId: any = null;
  private _remaining = 0;
  private _endTs = 0;
  private _paused = false;

  safeMessage = '';
  showClass = signal('');
  private doc = inject(DOCUMENT);
  private el = inject(ElementRef);
  constructor(private cdr: ChangeDetectorRef) {
    afterNextRender(() => {
      this.showClass.set('ngx-show');
    });
  }

  ngOnInit(): void {
    // decide how to render message
    if (this.payload.options.allowHtml) {
      this.safeMessage = this.payload.message;
    } else {
      this.safeMessage = this.escapeHtml(this.payload.message);
    }

    if (this.payload.options.timeout && this.payload.options.timeout > 0) {
      this.startTimer(this.payload.options.timeout);
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  // Public API to start timer (used by service when created)
  startTimer(ms: number) {
    this.clearTimer();
    this._remaining = ms;
    this._endTs = Date.now() + ms;
    this._timeoutId = setTimeout(
      () => this.onFinish.emit({ id: this.payload.id, el: this.el.nativeElement }),
      ms,
    );
  }
  pauseTimer() {
    if (!this._timeoutId) return;
    this._paused = true;
    clearTimeout(this._timeoutId);
    this._remaining = Math.max(0, this._endTs - Date.now());
  }

  resumeTimer() {
    if (!this._paused || this._remaining <= 0) return;
    this._paused = false;
    this.startTimer(this._remaining);
  }

  close(ev?: Event) {
    if (ev) ev.stopPropagation();
    this.onClose.emit({ id: this.payload.id, el: this.el.nativeElement });
  }

  onMouseEnter() {
    if (this.payload.options.pauseOnHover) this.pauseTimer();
  }
  onMouseLeave() {
    if (this.payload.options.pauseOnHover) this.resumeTimer();
  }

  escapeHtml(input: string) {
    const div = this.doc.createElement('div');
    div.appendChild(this.doc.createTextNode(input));
    return div.innerHTML;
  }

  ngOnDestroyCleanup() {
    this.clearTimer();
  }

  private clearTimer() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }
}
