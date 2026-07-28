import { Component, HostListener } from '@angular/core';
import { IMessageOptions } from '../models/message-options.interface';
import { Subject } from 'rxjs';
import { MessageResult, DismissReason } from '../models/message-result';
import { CommonModule } from '@angular/common';
import { NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from '../models/configs';

@Component({
  selector: 'ngx-message',
  templateUrl: 'message.component.html',
  styleUrls: ['./message.component.scss', './message-icons.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NGX_MESSAGE_CONFIGS,
      useValue: NGX_MESSAGE_DEFAULT_OPTIONS,
    },
  ],
})
export class NgxMessageComponent {
  options!: IMessageOptions;
  index = 0;

  private readonly _onClose = new Subject<{ index: number; result: MessageResult<any> }>();
  public onClose = this._onClose.asObservable();

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
