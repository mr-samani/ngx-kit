import {
  Injectable,
  ComponentRef,
  DOCUMENT,
  inject,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
  EventEmitter,
} from '@angular/core';
import { NgxNotifyOptions } from '../models/notify-options';
import { INotifyEnd, NgxNotifyPayload, NgxNotifyType } from '../models/notify.model';
import { WINDOW } from 'ngx-kit/shared';
import { NGX_NOTIFY_CONFIG } from '../models/notify-config';
import { NgxNotificationComponent } from '../components/notification.component';

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
  constructor() {}

  configureContainer(position: NgxNotifyOptions['position'], containerClass: string) {
    if (!this.container) {
      this.container = this.doc.createElement('div');
      this.doc.body.appendChild(this.container);
    }

    this.container.className = containerClass + ' ngx-notify-container ' + `ngx-pos-${position}`;
    this.container.style.position = 'fixed';
    this.container.style.zIndex = '99999';

    // center special
    if (position === 'center') {
      this.container.style.left = '50%';
      this.container.style.top = '50%';
      this.container.style.transform = 'translate(-50%,-50%)';
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'column';
      this.container.style.alignItems = 'center';
      this.container.style.pointerEvents = 'none';
    } else {
      if (position?.includes('center')) {
        this.container.style.left = '50%';
        this.container.style.transform = 'translateX(-50%)';
      } else {
        this.container.style.transform = 'translateX(0)';
      }
      // corners
      if (position?.includes('top')) {
        this.container.style.top = '20px';
      } else {
        this.container.style.bottom = '20px';
      }
      if (position?.includes('left')) {
        this.container.style.left = '20px';
        this.container.style.right = 'auto';
      }
      if (position?.includes('right')) {
        this.container.style.right = '20px';
        this.container.style.left = 'auto';
      }
      //  else container.style.right = '20px';
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'column';
      if (position?.includes('bottom')) this.container.style.flexDirection = 'column-reverse';
      this.container.style.pointerEvents = 'none';
    }
  }

  show(
    message: string,
    description?: string,
    type: NgxNotifyType = 'info',
    options?: NgxNotifyOptions,
  ) {
    const opts: NgxNotifyOptions = { ...this.defaultOptions, ...(options || {}) };
    const id =
      typeof (this.win as any).crypto?.randomUUID === 'function'
        ? (this.win as any).crypto.randomUUID()
        : makeId();

    const payload: NgxNotifyPayload = {
      id,
      message,
      description,
      type,
      options: opts,
      onClose: new EventEmitter(),
      onFinish: new EventEmitter(),
      close: () => this.close(id),
    };

    this.configureContainer(opts.position!, opts.containerClass!);

    // queue or show immediately
    if (this.visible.length >= opts.maxVisible!) {
      this.queue.push(payload);
    } else {
      this._createAndShow(payload);
    }
    return payload;
  }

  private _createAndShow(payload: NgxNotifyPayload) {
    if (!this.container)
      this.configureContainer(payload.options.position!, payload.options.containerClass!);
    const host = document.createElement('div');
    this.container!.appendChild(host);

    const compRef = createComponent(NgxNotificationComponent, {
      environmentInjector: this.envInjector,
      hostElement: host,
    });

    compRef.setInput('payload', payload);
    compRef.instance.onClose.subscribe((d) => {
      this.removeEl(d);
      payload.onClose.emit(d);
    });
    compRef.instance.onFinish.subscribe((d) => {
      this.removeEl(d);
      payload.onFinish.emit(d);
      payload.onClose.emit(d);
    });

    // Registers the component’s view so it participates in change detection cycle.
    this.appRef.attachView(compRef.hostView);
    // store visible
    this.visible.push({ ref: compRef, payload });
  }

  private close(id: string) {
    const el = this.visible.find((x) => x.payload.id == id)?.ref?.instance?.el;
    if (el) {
      this.removeEl({ id, el });
    }
    // if in queue remove it
    this.queue = this.queue.filter((q) => q.id !== id);
  }
  private removeNode(node: HTMLElement, id: string) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(-30px)';
    node.style.transition = 'all 300ms';
    setTimeout(() => {
      const item = this.visible.find((x) => x.payload.id === id);
      if (item) {
        this.appRef.detachView(item.ref.hostView);
        item.ref.destroy();
      }
      this.visible = this.visible.filter((v) => v.payload.id !== id);
      // show next in queue
      this._showNextIfPossible();
    }, 300);
  }

  private removeEl(d: INotifyEnd) {
    if (d.el) this.removeNode(d.el, d.id);
    else {
      // if in queue remove it
      this.queue = this.queue.filter((q) => q.id !== d.id);
    }
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
