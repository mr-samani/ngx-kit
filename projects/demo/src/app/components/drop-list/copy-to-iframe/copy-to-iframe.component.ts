import {
  Component,
  DOCUMENT,
  viewChild,
  ApplicationRef,
  ElementRef,
  Injector,
  OnInit,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import {
  moveItemInArray,
  NgxDraggable,
  IDropEvent,
  NgxDropList,
  NgxDropListGroup,
  DragDropService,
} from 'ngx-kit/drag-resize';
import { BaseContentComponent } from './iframe';

@Component({
  selector: 'app-copy-to-iframe',
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup],
  templateUrl: './copy-to-iframe.component.html',
  styleUrl: './copy-to-iframe.component.scss',
})
export class CopyToIFrameComponent implements OnInit {
  sourceList: string[] = [];
  targetList: { id: string; title: string }[] = [];
  private readonly iframe = viewChild.required<ElementRef<HTMLIFrameElement>>('iframe');
  private iframeApp?: ApplicationRef;

  constructor(private injector: Injector) {
    this.sourceList = [];
    for (let i = 1; i < 80; i++) {
      this.sourceList.push('Item  ' + i);
    }
  }

  ngOnInit(): void {
    this.loadIframe();
  }
  async loadIframe() {
    const iframe = this.iframe()?.nativeElement;
    if (!iframe) return;

    const doc = iframe.contentDocument!;
    const style = doc.createElement('style');
    style.innerHTML = `body{
        color: #000;
        background: #fff;
        height:100%;
        padding:0;
        margin:0;
    }`;
    doc.head.appendChild(style);
    // clean previous data
    doc.body.innerHTML = '';
    const host = doc.createElement('my-app');
    doc.body.appendChild(host);

    const drp = this.injector.get(DragDropService);

    // create new Angular Application Instance
    this.iframeApp = await createApplication({
      providers: [
        // خیلی مهم:
        // Angular را مجبور می‌کنیم DOCUMENT را
        // همان document مربوط به iframe بداند.
        {
          provide: DOCUMENT,
          useValue: doc,
        },
        {
          provide: DragDropService,
          useValue: drp,
        },
      ],
    });

    // کامپوننت Angular را داخل iframe bootstrap می‌کنیم
    this.iframeApp.bootstrap(BaseContentComponent, {
      hostElement: host,
    });
  }

  ngOnDestroy() {
    this.iframeApp?.destroy();
  }
}
