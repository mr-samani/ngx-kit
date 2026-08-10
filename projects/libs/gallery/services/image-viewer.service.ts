import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  inject,
} from '@angular/core';
import { NgxImageViewerComponent } from '../components/image-viewer.component';
import { NgxImageViewerItem, NgxImageViewerToolbarConfig } from '../contracts/image-viewer-types';

export interface NgxImageViewerOpenOptions {
  startIndex?: number;
  toolbar?: NgxImageViewerToolbarConfig;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

/**
 * راه میان‌بر برای وقتی که کاربر می‌خواد ویوئر رو داخل یه دیالوگِ تمام‌صفحه
 * باز کنه، بدون این‌که خودش دستی wire کنه. اگه کسی می‌خواد داخل دیالوگِ
 * خودش (مثلاً ngx-kit/dialog) بذارتش، کافیه مستقیم از NgxImageViewerComponent
 * استفاده کنه — این سرویس صرفاً یه میان‌بَره، وابستگی اجباری نیست.
 *
 * دقیقاً همون الگوی امن‌شده‌ی NgxMessageService: با Map<id, ComponentRef> و
 * detachView قبل از destroy، تا اون نشتی حافظه‌ای که قبلاً توی message
 * service پیدا و رفع شد، اینجا از اول تکرار نشه.
 */
@Injectable({ providedIn: 'root' })
export class NgxImageViewerService {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private nextId = 0;
  private readonly openInstances = new Map<number, ComponentRef<NgxImageViewerComponent>>();

  open(
    images: NgxImageViewerItem[],
    options: NgxImageViewerOpenOptions = {},
  ): { close: () => void } {
    const componentRef = createComponent(NgxImageViewerComponent, {
      environmentInjector: this.envInjector,
    });

    componentRef.setInput('images', images);
    if (options.startIndex != null) componentRef.setInput('startIndex', options.startIndex);
    componentRef.setInput('toolbar', { close: true, ...options.toolbar });
    if (options.minZoom != null) componentRef.setInput('minZoom', options.minZoom);
    if (options.maxZoom != null) componentRef.setInput('maxZoom', options.maxZoom);
    if (options.zoomStep != null) componentRef.setInput('zoomStep', options.zoomStep);

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;

    const dialog = document.createElement('dialog');
    dialog.className = 'ngx-image-viewer-dialog';
    dialog.appendChild(domElem);
    document.body.appendChild(dialog);
    dialog.showModal();
    domElem.focus?.();

    const id = this.nextId++;
    this.openInstances.set(id, componentRef);

    const close = () => {
      const ref = this.openInstances.get(id);
      if (!ref) return;
      try {
        if (dialog.open) dialog.close();
      } catch {
        /* noop */
      }
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      dialog.remove();
      this.openInstances.delete(id);
    };

    componentRef.instance.closed.subscribe(close);
    dialog.addEventListener('cancel', close, { once: true });

    return { close };
  }
}
