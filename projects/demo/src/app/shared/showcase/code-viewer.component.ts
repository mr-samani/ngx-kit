import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { DarkModeService } from '../services/dark-mode.service';

/**
 * نمایشگر سورس فقط-خواندنی روی پایه‌ی Monaco؛ آدرس فایل رو می‌گیره
 * (که با assets glob پروژه به‌صورت متن خام سرو می‌شه، دقیقاً همون سورس
 * واقعیِ دموئه، نه یه کپیِ جدا نگه‌داری‌شده) و با httpResource (سیگنال‌محور،
 * استاندارد Angular 22) fetch می‌کنه.
 */
@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [EditorComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (source.isLoading()) {
      <div class="code-viewer-state">Loading source…</div>
    } @else if (source.error()) {
      <div class="code-viewer-state code-viewer-state--error">
        Source not available for this file.
      </div>
    } @else {
      <ngx-monaco-editor
        class="code-viewer-editor"
        [options]="editorOptions()"
        [ngModel]="source.value() ?? ''" />
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .code-viewer-editor {
        display: block;
        block-size: 100%;
        min-height: 70dvh;
        direction: ltr;
      }
      .code-viewer-state {
        padding: 1rem;
        font-size: 0.85rem;
        color: light-dark(#6b7280, #9ca3af);
      }
      .code-viewer-state--error {
        color: light-dark(#b91c1c, #f87171);
      }
    `,
  ],
})
export class CodeViewerComponent {
  /** آدرس فایل سورس (نسبی، مثلاً /examples/dialog/dialog.ts) */
  path = input.required<string>();
  language = input<'typescript' | 'html' | 'scss'>('typescript');

  private readonly darkMode = inject(DarkModeService);

  protected readonly source = httpResource.text(() => document.baseURI + this.path());

  protected readonly editorOptions = computed(() => ({
    theme: this.darkMode.isDarkMode() ? 'vs-dark' : 'vs',
    language: this.language(),
    readOnly: true,
    domReadOnly: true,
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 13,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none' as const,
    contextmenu: false,
  }));
}
