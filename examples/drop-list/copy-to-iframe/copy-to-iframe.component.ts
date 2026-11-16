import {
  Component,
  DOCUMENT,
  viewChild,
  ApplicationRef,
  ElementRef,
  Injector,
  AfterViewInit,
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
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-copy-to-iframe',
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup, ExampleShowcaseComponent],
  templateUrl: './copy-to-iframe.component.html',
  styleUrl: './copy-to-iframe.component.scss',
})
export class CopyToIFrameComponent implements AfterViewInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/drop-list/copy-to-iframe/copy-to-iframe.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/drop-list/copy-to-iframe/copy-to-iframe.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/drop-list/copy-to-iframe/copy-to-iframe.component.scss',
      language: 'scss',
    },
    {
      label: 'Iframe component',
      path: 'examples/drop-list/copy-to-iframe/iframe.ts',
      language: 'typescript',
    },
  ];

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

  ngAfterViewInit(): void {
    void this.loadIframe();
  }
  async loadIframe() {
    const iframe = this.iframe().nativeElement;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? (await this.initializeIframeDocument(iframe));
    const style = doc.createElement('style');
    const parentDocument = this.injector.get(DOCUMENT);
    doc.documentElement.dir = parentDocument.documentElement.dir || 'ltr';

    style.textContent = `
      body {
        color: #000;
        background: #fff;
        min-height: 100%;
        padding: 0;
        margin: 0;
      }
    `;
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

  private initializeIframeDocument(iframe: HTMLIFrameElement): Promise<Document> {
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        const doc = iframe.contentDocument;
        if (doc?.documentElement.dataset['demoIframeReady'] === 'true') {
          clearTimeout(timeoutId);
          iframe.removeEventListener('load', onLoad);
          resolve(doc);
        }
      };

      const timeoutId = window.setTimeout(() => {
        iframe.removeEventListener('load', onLoad);
        reject(new Error('The iframe document did not finish loading.'));
      }, 10_000);

      iframe.addEventListener('load', onLoad);
      iframe.srcdoc =
        '<!doctype html><html data-demo-iframe-ready="true"><head></head><body></body></html>';
    });
  }

  ngOnDestroy() {
    this.iframeApp?.destroy();
  }
}
