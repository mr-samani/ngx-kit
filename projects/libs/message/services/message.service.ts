import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  EventEmitter,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from '../models/tokens';
import { IMessageOptions } from '../models/message-options.interface';
import { MessageOutput, MessageResult } from '../models/message-result';
import { DOCUMENT } from '@angular/common';
import { NgxMessageComponent } from '../components/message.component';
import { applyDefaultConfig } from './apply-default';

@Injectable({
  providedIn: 'root',
})
export class NgxMessageService {
  // قبلاً یه آرایه‌ی معمولی بود (`ComponentRef[]`) و removeDialogComponentFromBody
  // فقط componentRef رو destroy می‌کرد ولی هیچ‌وقت از آرایه حذفش نمی‌کرد — یعنی
  // این سرویس (که providedIn:'root' و singleton سراسریه) به ازای هر پیامی که
  // تا حالا تو کل عمر اپ نشون داده شده، یک رفرنس destroy-شده رو برای همیشه نگه
  // می‌داشت: یک نشتی حافظه‌ی پیوسته. با Map<id, ComponentRef> جایگزین شد که
  // با delete واقعاً entry رو آزاد می‌کنه؛ کلید هم شناسه‌ی پایدارِ پیام (insertedId)
  // هست، نه موقعیتِ آرایه (که با splice ممکن بود جابه‌جا و نامعتبر بشه).
  alerts = new Map<number, ComponentRef<NgxMessageComponent>>();
  insertedId = 0;
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector,
    @Inject(DOCUMENT) private _doc: Document,
  ) {}

  public show<T = any>(c?: IMessageOptions): MessageOutput<T> {
    let d = applyDefaultConfig(
      this.injector.get(NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS),
      NGX_MESSAGE_DEFAULT_OPTIONS,
    );
    const config = applyDefaultConfig(c, d);

    const componentRef = createComponent(NgxMessageComponent, {
      environmentInjector: this.envInjector,
    });

    this.appRef.attachView(componentRef.hostView);
    const id = this.insertedId++;
    const payload: MessageOutput<T> = {
      close: () => componentRef.instance.close(),
      id,
      afterClose: new EventEmitter(),
    };
    this.appendDialogComponentToBody(componentRef, config);
    componentRef.instance.options = config;
    componentRef.instance.index = id;
    componentRef.instance.onClose.subscribe((result) => {
      this.removeDialogComponentFromBody(result.index);
      payload.afterClose.emit(result.result);
    });
    this.alerts.set(id, componentRef);

    return payload;
  }

  private removeDialogComponentFromBody(id: number): void {
    const ref = this.alerts.get(id);
    if (!ref) return;

    const domElem = (ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // قبل از destroy باید hidePopover صدا بزنیم
    if (domElem.popover === 'manual') {
      try {
        domElem.hidePopover();
      } catch {}
    }

    this.appRef.detachView(ref.hostView);
    ref.destroy();
    this.alerts.delete(id);
  }

  private appendDialogComponentToBody(
    componentRef: ComponentRef<NgxMessageComponent>,
    config: IMessageOptions,
  ) {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    if (config.containerClass) {
      for (let c of config.containerClass.split(' ')) {
        if (c.trim()) domElem.classList.add(c);
      }
    }
    this._doc.body.appendChild(domElem);
    if (config.useOverlay) {
      domElem.popover = 'manual';
      domElem.showPopover();
    }
  }

  closeAll() {
    for (const id of [...this.alerts.keys()]) {
      this.removeDialogComponentFromBody(id);
    }
  }
}
