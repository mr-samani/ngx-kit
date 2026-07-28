import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IMessageOptions } from '../models/message-options.interface';
import { Subject } from 'rxjs';
import { MessageResult, DismissReason } from '../models/message-result';
import { CommonModule } from '@angular/common';
import { NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from '../models/configs';
import { ICONS } from '../models/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { makeConfetti } from 'ngx-kit/shared';

@Component({
  selector: 'ngx-message',
  templateUrl: 'message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  providers: [
    {
      provide: NGX_MESSAGE_CONFIGS,
      useValue: NGX_MESSAGE_DEFAULT_OPTIONS,
    },
  ],
})
export class NgxMessageComponent implements OnInit, AfterViewInit {
  icon?: SafeHtml;
  showIcon = signal(true);
  options!: IMessageOptions;
  confetti = viewChild<ElementRef<HTMLDivElement>>('confetti');
  index = 0;

  protected sanitizer = inject(DomSanitizer);
  protected doc = inject(DOCUMENT);

  private readonly _onClose = new Subject<{ index: number; result: MessageResult<any> }>();
  public onClose = this._onClose.asObservable();

  ngOnInit(): void {
    this.showIcon.update((x) => (x = this.options.icon != 'None'));
    this.icon = this.sanitizer.bypassSecurityTrustHtml(ICONS[this.options.icon ?? 'None']);
  }

  ngAfterViewInit(): void {
    const confetti = this.confetti()?.nativeElement;
    if (this.options.icon == 'success' && confetti) {
      makeConfetti(this.doc, confetti);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onScapeKey(event: Event) {
    if (this.options.allowEscapeKey) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.options.allowEnterKey) {
      if (this.options.showConfirmButton) {
        this.onConfirm();
      } else if (this.options.showDenyButton) {
        this.onDeny();
      } else {
        this.onCancel();
      }
    }
  }

  onConfirm() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: true,
        isDismissed: false,
        isDenied: false,
        dismiss: DismissReason.close,
      },
    });
  }
  onCancel() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: false,
        isDismissed: true,
        isDenied: false,
        dismiss: DismissReason.cancel,
      },
    });
  }
  onDeny() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: false,
        isDismissed: false,
        isDenied: true,
        dismiss: DismissReason.close,
      },
    });
  }
  close() {
    this.onCancel();
  }

  onOutSideClick() {
    if (this.options.allowOutsideClick) {
      this.onCancel();
    }
  }
  innerOnClick(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
  }
}
