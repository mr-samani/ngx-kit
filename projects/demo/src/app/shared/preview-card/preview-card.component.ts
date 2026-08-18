import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DarkModeService } from '@demo/shared/services/dark-mode.service';

const PALETTE: [string, string][] = [
  ['#6366f1', '#2563eb'],
  ['#ec4899', '#f59e0b'],
  ['#10b981', '#0ea5e9'],
  ['#f97316', '#ef4444'],
  ['#8b5cf6', '#6366f1'],
  ['#06b6d4', '#3b82f6'],
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * کارت پیش‌نمایشِ دوتِمی برای صفحه‌ی اصلی: یه پنجره‌ی مینیاتوریِ ساختگی رو
 * دوبار رندر می‌کنه — یکی با data-ngx-theme="light" یکی "dark" — و بر اساس
 * تمِ فعلیِ اپ، اونی که مطابق تمه رو با z-index/چرخش/مقیاسِ بیشتر میاره
 * جلو. چون data-ngx-theme روی زیرشاخه‌اش color-scheme رو force می‌کنه، همه‌ی
 * light-dark() هایی که خودِ کتابخونه استفاده می‌کنه (که قبلاً درستش کردیم)
 * درونِ هرکدوم از این دو پنجره درست resolve می‌شن — یعنی این واقعاً همون
 * سیستم رنگیِ خودِ کتابخونه‌ست، نه یه رنگِ ساختگیِ جدا.
 */
@Component({
  selector: 'app-preview-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
})
export class PreviewCardComponent {
  seed = input.required<string>();
  icon = input<string>('◆');

  private readonly darkMode = inject(DarkModeService);
  protected readonly isPageDark = computed(() => this.darkMode.isDarkMode());

  protected readonly gradient = computed(() => {
    const [a, b] = PALETTE[hashString(this.seed()) % PALETTE.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  });
}
