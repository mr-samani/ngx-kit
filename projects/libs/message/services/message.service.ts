import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from '../models/configs';
import { IMessageOptions } from '../models/message-options.interface';
import { MessageResult } from '../models/message-result';
import { DOCUMENT } from '@angular/common';
import { NgxMessageComponent } from '../components/message.component';
import { applyDefaultConfig } from './apply-default';

@Injectable({
  providedIn: 'root',
})
export class NgxMessageService {
  currentAdIndex = -1;
  alerts: ComponentRef<NgxMessageComponent>[] = [];
  insertedId = 0;
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector,
    @Inject(DOCUMENT) private _doc: Document,
  ) {}

  public show(c?: IMessageOptions): Promise<MessageResult<any>> {
    let d = applyDefaultConfig(
      this.injector.get(NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS),
      NGX_MESSAGE_DEFAULT_OPTIONS,
    );
    const config = applyDefaultConfig(c, d);
    return new Promise((resolve, reject) => {
      const componentRef = createComponent(NgxMessageComponent, {
        environmentInjector: this.envInjector,
      });

      this.appRef.attachView(componentRef.hostView);

      this.appendDialogComponentToBody(componentRef, config);
      componentRef.instance.options = config;
      componentRef.instance.index = this.insertedId;
      componentRef.instance.onClose.subscribe((result) => {
        this.removeDialogComponentFromBody(result.index);
        resolve(result.result);
      });
      this.alerts.push(componentRef);
      this.insertedId++;
    });
  }

  private removeDialogComponentFromBody(index: number): void {
    if (this.alerts[index]) {
      const domElem = (this.alerts[index].hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      // قبل از destroy باید hidePopover صدا بزنیم
      if (domElem.popover === 'manual') {
        try {
          domElem.hidePopover();
        } catch {}
      }

      this.appRef.detachView(this.alerts[index].hostView);
      this.alerts[index].destroy();
    }
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
    for (let i = 0; i < this.alerts.length; i++) {
      this.removeDialogComponentFromBody(i);
    }
  }
}
