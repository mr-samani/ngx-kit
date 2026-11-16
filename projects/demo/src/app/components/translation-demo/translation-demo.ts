import { Component, computed, inject, model } from '@angular/core';
import {
  ExampleSourceFile,
  ExampleShowcaseComponent,
} from '@demo/shared/showcase/example-showcase.component';
import { I18nService, injectT, translateSignal, TrPipe } from 'ngx-kit/lazy-i18n';

@Component({
  selector: 'app-translation-demo',
  templateUrl: 'translation-demo.html',
  imports: [ExampleShowcaseComponent, TrPipe],
})
export class TranslationDemoComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/translation-demo/translation-demo.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/translation-demo/translation-demo.html', language: 'html' },
  ];

  name = model('MR-Samani');

  private i18n = inject(I18nService);
  title = translateSignal('orders.title');
  hello = translateSignal('hello', () => ({ name: this.name() })); // params may read signals
  t = injectT();
  lang = this.i18n.lang; // Signal<string>
  dir = this.i18n.dir; // Signal<'rtl' | 'ltr'>

  setLanguage(lang: 'en' | 'fa') {
    this.i18n.use(lang);
  }

  onNameChange(event: Event) {
    this.name.set((event.currentTarget as HTMLInputElement).value);
  }
}
