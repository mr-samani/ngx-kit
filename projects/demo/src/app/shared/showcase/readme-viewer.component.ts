import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { marked } from 'marked';

/**
 * README.md واقعیِ خودِ لایبرری رو (که با یه asset glob تحت /readmes/...
 * سرو می‌شه — دقیقاً همون فایلیه که توی پوشه‌ی لایبرریه، کپی‌ی جدایی نیست)
 * fetch می‌کنه و با marked به HTML تبدیل می‌کنه. از httpResource (سیگنال‌
 * محور، همون الگویی که برای CodeViewerComponent استفاده شده) برای فچ استفاده
 * می‌کنه، پس دقیقاً همون تجربه‌ی لودینگ/خطا رو داره.
 */
@Component({
  selector: 'app-readme-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (source.isLoading()) {
      <div class="readme-state">در حال بارگذاری مستندات…</div>
    } @else if (source.error()) {
      <div class="readme-state readme-state--error">مستنداتی برای این کامپوننت پیدا نشد.</div>
    } @else {
      <div class="readme-content" [innerHTML]="renderedHtml()"></div>
    }
  `,
  styleUrl: './readme-viewer.component.scss',
})
export class ReadmeViewerComponent {
  path = input.required<string>();

  protected readonly source = httpResource.text(() => this.path());

  protected readonly renderedHtml = computed(() => {
    const md = this.source.value();
    if (!md) return '';
    // Angular خودش موقع بایند به [innerHTML] پاک‌سازی امنیتی انجام می‌ده
    // (تگ/اتریبیوت خطرناک حذف می‌شه)، پس نیازی به sanitize دستیِ اضافه نیست؛
    // فقط کافیه یه رشته‌ی HTML معمولی بدیم.
    return marked.parse(md, { async: false }) as string;
  });
}
