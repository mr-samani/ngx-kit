import { EventEmitter, inject, Injectable, Injector } from '@angular/core';
import { NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from '../models/tokens';
import { IMessageOptions } from '../models/message-options.interface';
import { MessageOutput } from '../models/message-result';
import { NgxMessageComponent } from '../components/message.component';
import { applyDefaultConfig } from './apply-default';
import { OverlayService, OverlayRef } from 'ngx-kit/core';

@Injectable({
  providedIn: 'root',
})
export class NgxMessageService {
  alerts = new Map<number, OverlayRef<NgxMessageComponent>>();

  protected readonly overlay = inject(OverlayService);
  insertedId = 0;
  constructor(private injector: Injector) {}

  public show<T = any>(c?: IMessageOptions): MessageOutput<T> {
    let d = applyDefaultConfig(
      this.injector.get(NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS),
      NGX_MESSAGE_DEFAULT_OPTIONS,
    );
    const config: IMessageOptions = applyDefaultConfig(c, d);

    const id = this.insertedId++;
    const payload: MessageOutput<T> = {
      close,
      id,
      afterClose: new EventEmitter(),
    };
    const ref = this.overlay.open({
      component: NgxMessageComponent,
      usePopover: config.useOverlay,
      closeOnEscape: config.allowEscapeKey,
      closeOnOutsideClick: config.allowOutsideClick,
      alignment: 'center',
      placement: 'center',
      ariaDescribedby: config.ariaDescribedby,
      ariaLabel: config.ariaLabel,
      ariaLabelledby: config.ariaLabelledby,
      ariaModal: true,
      role: 'alertdialog',
      backdropClass: 'ngx-msg-backdrop',
      panelClass: 'ngx-msg-panel',
      configure: (instance, ref) => {
        instance.options = config;
        instance.index = id;
        instance.onClose.subscribe((result) => {
          this.remove(result.index);
          payload.afterClose.emit(result.result);
        });
      },
      onClosed: () => this.remove(id),
    });

    this.alerts.set(id, ref);

    return payload;
  }

  private remove(id: number): void {
    const ref = this.alerts.get(id);
    if (!ref) return;
    ref.close();
    this.alerts.delete(id);
  }

  closeAll() {
    this.alerts.forEach((item) => {
      item.close();
    });
    this.alerts.clear();
  }
}
