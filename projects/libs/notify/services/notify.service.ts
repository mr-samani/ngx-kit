import {
  Injectable,
  ComponentRef,
  DOCUMENT,
  inject,
  createComponent,
  Injector,
  EnvironmentInjector,
  ApplicationRef,
} from '@angular/core';
import { NgxNotifyOptions } from '../models/notify-options';
import { NgxNotifyPayload, NgxPgNotifyType } from '../models/notify.model';
import { WINDOW } from 'ngx-kit/shared';
import { NGX_NOTIFY_CONFIG } from '../models/notify-config';
import { NgxPgNotificationComponent } from '../components/notification.component';

// We'll include a tiny inline uuid fallback if uuid package is not available
function makeId() {
  // simple random id
  return 'n_' + Math.random().toString(36).substr(2, 9);
}

@Injectable({ providedIn: 'root' })
export class NgxNotifyService {
  private queue: NgxNotifyPayload[] = [];
  private visible: { ref: ComponentRef<any>; payload: NgxNotifyPayload }[] = [];
  private container: HTMLElement | null = null;

  private envInjector = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);
  private doc = inject(DOCUMENT);
  private win = inject(WINDOW);
  private defaultOptions = inject(NGX_NOTIFY_CONFIG);
  constructor() {
    if (this.win) {
      // global event listeners for notifications finishing or close
      this.win.addEventListener('ngx-notify:finish', (e: any) =>
        this.onNotificationFinish(e.detail.id, e.detail.el),
      );
      this.win.addEventListener('ngx-notify:close', (e: any) =>
        this.onNotificationClose(e.detail.id, e.detail.el),
      );
    }
  }

  configureContainer(position: NgxNotifyOptions['position'], containerClass: string) {
    if (this.container) return; // created already

    const container = this.doc.createElement('div');
    container.className = containerClass + ' ngx-notify-container ' + `ngx-pos-${position}`;
    container.style.position = 'fixed';
    container.style.zIndex = '99999';

    // center special
    if (position === 'center') {
      container.style.left = '50%';
      container.style.top = '50%';
      container.style.transform = 'translate(-50%,-50%)';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.pointerEvents = 'none';
    } else {
      if (position?.includes('center')) {
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
      }
      // corners
      if (position?.includes('top')) container.style.top = '20px';
      else container.style.bottom = '20px';
      if (position?.includes('left')) container.style.left = '20px';
      //  else container.style.right = '20px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      if (position?.includes('bottom')) container.style.flexDirection = 'column-reverse';
      container.style.pointerEvents = 'none';
    }

    this.doc.body.appendChild(container);
    this.container = container;
  }

  show(message: string, type: NgxPgNotifyType = 'info', options?: NgxNotifyOptions) {
    const opts: NgxNotifyOptions = { ...this.defaultOptions, ...(options || {}) };
    const id =
      typeof (this.win as any).crypto?.randomUUID === 'function'
        ? (this.win as any).crypto.randomUUID()
        : makeId();

    const payload: NgxNotifyPayload = { id, message, type, options: opts };

    this.configureContainer(opts.position!, opts.containerClass!);

    // queue or show immediately
    if (this.visible.length >= opts.maxVisible!) {
      this.queue.push(payload);
    } else {
      this._createAndShow(payload);
    }
  }

  private _createAndShow(payload: NgxNotifyPayload) {
    if (!this.container)
      this.configureContainer(payload.options.position!, payload.options.containerClass!);
    const host = document.createElement('div');
    this.container!.appendChild(host);

    const compRef = createComponent(NgxPgNotificationComponent, {
      environmentInjector: this.envInjector,
      hostElement: host,
    });
    compRef.instance.payload = payload;
    // Registers the component’s view so it participates in change detection cycle.
    this.appRef.attachView(compRef.hostView);
    // store visible
    this.visible.push({ ref: compRef, payload });
  }
  private removeNode(node: HTMLElement, id: string) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(-30px)';
    node.style.transition = 'all 300ms';
    setTimeout(() => {
      const item = this.visible.find((x) => x.payload.id === id);
      if (item) {
        this.appRef.attachView(item.ref.hostView);
        item.ref.destroy();
      }
      this.visible = this.visible.filter((v) => v.payload.id !== id);
      // show next in queue
      this._showNextIfPossible();
    }, 300);
  }

  private removeEl(el: HTMLElement, id: string) {
    if (el) this.removeNode(el, id);
    else {
      // if in queue remove it
      this.queue = this.queue.filter((q) => q.id !== id);
    }
  }

  private onNotificationFinish(id: string, el: HTMLElement) {
    this.removeEl(el, id);
  }
  private onNotificationClose(id: string, el: HTMLElement) {
    this.removeEl(el, id);
  }

  private _showNextIfPossible() {
    if (!this.queue.length) return;
    const next = this.queue.shift()!;
    // ensure we don't exceed maxVisible
    if (this.visible.length < next.options.maxVisible!) {
      this._createAndShow(next);
    } else {
      // push back
      this.queue.unshift(next);
    }
  }
}
