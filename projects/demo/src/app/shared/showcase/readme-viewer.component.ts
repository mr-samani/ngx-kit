import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import { DarkModeService } from '../services/dark-mode.service';
import { MarkdownThemeLoader } from './markdown-theme-loader';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
/**
 * README.md واقعیِ خودِ لایبرری رو (که با یه asset glob تحت readmes/...
 * سرو می‌شه — دقیقاً همون فایلیه که توی پوشه‌ی لایبرریه، کپی‌ی جدایی نیست)
 * fetch می‌کنه و با marked به HTML تبدیل می‌کنه. از httpResource (سیگنال‌
 * محور، همون الگویی که برای CodeViewerComponent استفاده شده) برای فچ استفاده
 * می‌کنه، پس دقیقاً همون تجربه‌ی لودینگ/خطا رو داره.
 */
@Component({
  selector: 'app-readme-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if (loading()) {
      <div class="ngx-markdown-loading">Loading...</div>
    }

    @if (error(); as errorMessage) {
      <div class="ngx-markdown-error">
        {{ errorMessage }}
      </div>
    }

    @if (!loading() && !error()) {
      <article class="markdown-body ngx-markdown-preview" [innerHTML]="html()"></article>
    }
  `,
  styleUrl: './readme-viewer.component.scss',
})
export class ReadmeViewerComponent {
  protected readonly darkMode = inject(DarkModeService);

  readonly src = input<string>();

  readonly markdown = input<string>();

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly html = signal<SafeHtml>('');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    afterNextRender(() => {
      this.load();

      const observer = new MutationObserver(() => {
        this.addCopyButtons();
      });

      observer.observe(this.elementRef.nativeElement, {
        childList: true,
        subtree: true,
      });

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
      });

      if (this.darkMode.isDarkMode()) {
        MarkdownThemeLoader.load('dark');
      } else {
        MarkdownThemeLoader.load('light');
      }

      this.darkMode.onChange.subscribe((theme) => {
        MarkdownThemeLoader.load(theme);
      });
    });
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      let content = this.markdown();

      const source = document.baseURI + this.src();

      if (source) {
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(
            `Unable to load Markdown file: ${response.status} ${response.statusText}`,
          );
        }

        content = await response.text();
      }

      if (!content) {
        this.html.set('');
        return;
      }

      this.html.set(await this.renderMarkdown(content));
    } catch (error) {
      console.error(error);

      this.error.set(error instanceof Error ? error.message : 'Unable to load Markdown.');
    } finally {
      this.loading.set(false);
    }
  }

  private async renderMarkdown(markdown: string) {
    const renderer = new Renderer();

    renderer.code = ({ text, lang }) => {
      const language = this.normalizeLanguage(lang);

      let highlighted: string;

      try {
        if (language && hljs.getLanguage(language)) {
          highlighted = hljs.highlight(text, {
            language,
          }).value;
        } else {
          highlighted = hljs.highlightAuto(text).value;
        }
      } catch {
        highlighted = this.escapeHtml(text);
      }

      const languageClass = language ? `language-${language}` : '';

      const html = `
        <div class="ngx-markdown-code">
          <div class="ngx-markdown-code__header">
            <span class="ngx-markdown-code__language">
              ${language || 'text'}
            </span>

            <button
              type="button"
              class="ngx-markdown-code__copy"
              data-copy-code
            >
              Copy
            </button>
          </div>

          <pre><code class="${languageClass} hljs">${highlighted}</code></pre>
        </div>
      `;
      return html;
    };

    marked.setOptions({
      gfm: true,
      breaks: false,
      renderer,
    });

    const result = marked.parse(markdown) as string;

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

  private normalizeLanguage(language?: string | null): string {
    if (!language) {
      return '';
    }

    const aliases: Record<string, string> = {
      ts: 'typescript',
      typescript: 'typescript',

      js: 'javascript',
      javascript: 'javascript',

      html: 'xml',
      htm: 'xml',
      xhtml: 'xml',

      css: 'css',
      scss: 'scss',
      sass: 'scss',

      json: 'json',

      sh: 'bash',
      shell: 'bash',
      bash: 'bash',

      yml: 'yaml',
      yaml: 'yaml',

      md: 'markdown',
      markdown: 'markdown',

      cs: 'csharp',
      csharp: 'csharp',

      xml: 'xml',

      sql: 'sql',

      java: 'java',

      cpp: 'cpp',
      'c++': 'cpp',

      c: 'c',

      powershell: 'powershell',
      ps: 'powershell',
    };

    return aliases[language.toLowerCase()] ?? language.toLowerCase();
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private addCopyButtons(): void {
    const root = this.elementRef.nativeElement;

    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-copy-code]');

    buttons.forEach((button) => {
      if (button.dataset['initialized']) {
        return;
      }

      button.dataset['initialized'] = 'true';

      button.addEventListener('click', async () => {
        const wrapper = button.closest('.ngx-markdown-code');

        const code = wrapper?.querySelector('code')?.textContent ?? '';

        try {
          await navigator.clipboard.writeText(code);

          const oldText = button.textContent;

          button.textContent = 'Copied!';

          setTimeout(() => {
            button.textContent = oldText || 'Copy';
          }, 1500);
        } catch (error) {
          console.error('Unable to copy code.', error);
        }
      });
    });
  }
}
