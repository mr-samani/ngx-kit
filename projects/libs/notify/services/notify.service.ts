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
import { WINDOW } from 'ngx-kit/core';
import { NGX_NOTIFY_CONFIG } from '../models/notify-config';
import { NgxNotificationComponent } from '../components/notification.component';

function makeId(): string {
  return 'n_' + Math.random().toString(36).substring(2, 11);
}

@Injectable({ providedIn: 'root' })
export class NgxNotifyService {
  private queue: NgxNotifyPayload[] = [];

  private visible: {
    ref: ComponentRef<NgxNotificationComponent>;
    payload: NgxNotifyPayload;
  }[] = [];

  private container: HTMLElement | null = null;

  private envInjector = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);
  private doc = inject(DOCUMENT);
  private win = inject(WINDOW);
  private defaultOptions = inject(NGX_NOTIFY_CONFIG);

  private removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {}

  configureContainer(opt: NgxNotifyOptions): void {
    const { containerClass, position, usePopover } = opt;

    if (!this.container) {
      this.container = this.doc.createElement('div');
      this.doc.body.appendChild(this.container);
    }

    const container = this.container;

    container.className = containerClass + ' ngx-notify-container ngx-pos-' + position;

    // Explicitly reset positioning so changing options does not leave
    // stale styles from the previous configuration.
    Object.assign(container.style, {
      position: 'fixed',
      zIndex: '99999',
      inset: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      margin: '0',
      transform: 'none',
      width: 'max-content',
      maxWidth: 'calc(100vw - 40px)',
      maxHeight: 'calc(100vh - 40px)',
      boxSizing: 'border-box',
      border: '0',
      padding: '0',
      background: 'transparent',
      color: 'inherit',
      overflow: 'visible',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    });

    // Detect the page's direction without requiring an extra option.
    const direction =
      container.closest('[dir]')?.getAttribute('dir') ||
      this.doc.documentElement.getAttribute('dir') ||
      this.doc.body?.getAttribute('dir') ||
      'ltr';

    container.dir = direction === 'rtl' ? 'rtl' : 'ltr';

    // Keep left/right as physical viewport positions.
    // RTL affects text direction, not the meaning of these positions.
    switch (position) {
      case 'center':
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.alignItems = 'center';
        break;

      default: {
        if (position?.includes('top')) {
          container.style.top = '20px';
        } else {
          container.style.bottom = '20px';
        }

        if (position?.includes('left')) {
          container.style.left = '20px';
          container.style.alignItems = 'flex-start';
        } else if (position?.includes('right')) {
          container.style.right = '20px';
          container.style.alignItems = 'flex-end';
        } else if (position?.includes('center')) {
          container.style.left = '50%';
          container.style.transform = 'translateX(-50%)';
          container.style.alignItems = 'center';
        }

        if (position?.includes('bottom')) {
          container.style.flexDirection = 'column-reverse';
        }

        break;
      }
    }

    if (usePopover) {
      // Apply the positioning styles before entering the top layer.
      container.setAttribute('popover', 'manual');

      if (!container.matches(':popover-open')) {
        try {
          container.showPopover();
        } catch {
          // Avoid breaking notification display if the browser does not
          // support Popover or the element cannot enter the top layer.
          container.removeAttribute('popover');
        }
      }
    } else {
      if (container.matches(':popover-open')) {
        try {
          container.hidePopover();
        } catch {
          // The element may already have left the top layer.
        }
      }

      container.removeAttribute('popover');
    }
  }

  show(
    message: string,
    description?: string,
    type: NgxNotifyType = 'info',
    options?: NgxNotifyOptions,
  ) {
    const opts: NgxNotifyOptions = {
      ...this.defaultOptions,
      ...(options || {}),
    };

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

    this.configureContainer(opts);

    // Cancel a pending removal if the same ID is ever reused.
    const timer = this.removalTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.removalTimers.delete(id);
    }

    if (this.visible.length >= opts.maxVisible!) {
      this.queue.push(payload);
    } else {
      this._createAndShow(payload);
    }

    return payload;
  }

  private _createAndShow(payload: NgxNotifyPayload): void {
    if (!this.container) {
      this.configureContainer(payload.options);
    }

    // Use DOCUMENT rather than the global document.
    const host = this.doc.createElement('div');

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

  private close(id: string): void {
    const item = this.visible.find((x) => x.payload.id === id);

    if (item) {
      const el = item.ref.instance.el.nativeElement;

      if (el) {
        this.removeEl({ id, el });
      }
    }

    // If the notification is still queued, remove it immediately.
    this.queue = this.queue.filter((q) => q.id !== id);

    this.cleanupIfEmpty();
  }

  private removeNode(node: HTMLElement, id: string): void {
    // Prevent multiple close/finish events from scheduling duplicate
    // removal operations for the same notification.
    if (this.removalTimers.has(id)) {
      return;
    }

    node.style.opacity = '0';
    node.style.transform = 'translateY(-30px)';
    node.style.transition = 'all 300ms';

    const timer = setTimeout(() => {
      this.removalTimers.delete(id);

      const item = this.visible.find((x) => x.payload.id === id);

      if (item) {
        this.appRef.detachView(item.ref.hostView);
        item.ref.destroy();
      }

      this.visible = this.visible.filter((v) => v.payload.id !== id);

      // Preserve queue behavior: make room first, then clean up.
      this._showNextIfPossible();

      this.cleanupIfEmpty();
    }, 300);

    this.removalTimers.set(id, timer);
  }

  private removeEl(d: INotifyEnd): void {
    if (d.el) {
      this.removeNode(d.el, d.id);
    } else {
      this.queue = this.queue.filter((q) => q.id !== d.id);
      this.cleanupIfEmpty();
    }
  }

  private _showNextIfPossible(): void {
    if (!this.queue.length) {
      return;
    }

    const next = this.queue[0];

    if (this.visible.length < next.options.maxVisible!) {
      this.queue.shift();

      // Reapply this notification's configuration if needed.
      this.configureContainer(next.options);
      this._createAndShow(next);
    }
  }

  private cleanupIfEmpty(): void {
    // Do not remove the container while notifications are visible,
    // waiting in the queue, or still animating out.
    if (this.visible.length > 0 || this.queue.length > 0 || this.removalTimers.size > 0) {
      return;
    }

    const container = this.container;

    if (!container) {
      return;
    }

    if (container.matches(':popover-open')) {
      try {
        container.hidePopover();
      } catch {
        // Ignore an already-closed popover.
      }
    }

    container.remove();
    this.container = null;
  }
}
