import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CodeViewerComponent } from './code-viewer.component';
import { ReadmeViewerComponent } from './readme-viewer.component';

export interface ExampleSourceFile {
  /** برچسبی که روی تب نشون داده می‌شه، مثلاً «TS» یا «HTML» */
  label: string;
  /** آدرس فایل، مثلاً examples/dialog/dialog.ts */
  path: string;
  language: 'typescript' | 'html' | 'scss';
}

/**
 * پوسته‌ی مشترک همه‌ی صفحات دمو: یک تب «پیش‌نمایش» (که محتوای واقعیِ
 * دمو رو با ng-content نشون می‌ده)، یک تب به ازای هر فایل سورس، و یک تب
 * «مستندات» اختیاری که README.md واقعیِ خودِ لایبرری رو نشون می‌ده (اگه
 * readmePath داده بشه). دقیقاً همون الگویی که کتابخونه‌های بزرگ (mui،
 * primeng، ...) استفاده می‌کنن، بدون نیاز به Storybook.
 *
 * نکته: تب پیش‌نمایش با `[hidden]` مخفی/نمایان می‌شه نه با `@if`، تا با
 * جابه‌جایی بین تب‌ها، state زنده‌ی دموی واقعی (مثلاً یه دیالوگ بازِ) از
 * بین نره.
 */
@Component({
  selector: 'app-example-showcase',
  standalone: true,
  imports: [CodeViewerComponent, ReadmeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example-showcase.component.html',
  styleUrl: './example-showcase.component.scss',
})
export class ExampleShowcaseComponent {
  title = input<string>('');
  files = input.required<ExampleSourceFile[]>();
  /** آدرس README.md لایبرری (مثلاً readmes/dialog/README.md)؛ اگه ندی، تب مستندات نشون داده نمی‌شه */
  readmePath = input<string | undefined>(undefined);

  /** 0 = پیش‌نمایش، ۱ به بعد = ایندکس فایل + ۱، آخری (اگه readmePath باشه) = مستندات */
  protected readonly activeTab = signal(0);

  protected select(index: number): void {
    this.activeTab.set(index);
  }
}
