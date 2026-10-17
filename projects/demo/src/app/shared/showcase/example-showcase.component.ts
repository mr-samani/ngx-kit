import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CodeViewerComponent } from './code-viewer/code-viewer.component';
import { ReadmeViewerComponent } from './read-me-viewer/readme-viewer.component';

export interface ExampleSourceFile {
  /** برچسبی که روی تب نشون داده می‌شه، مثلاً «TS» یا «HTML» */
  label: string;
  /** آدرس فایل، مثلاً examples/dialog/dialog.ts */
  path: string;
  language: 'typescript' | 'html' | 'scss';
}



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
