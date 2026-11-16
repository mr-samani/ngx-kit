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

export enum ActiveTabEnum {
  Doc = 1000,
  Preview = 1001,
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
  lable = input<string>('');
  files = input.required<ExampleSourceFile[]>();
  readmePath = input<string | undefined>(undefined);

  protected readonly activeTab = signal<ActiveTabEnum | number>(ActiveTabEnum.Doc);

  protected select(tab: ActiveTabEnum | number): void {
    this.activeTab.set(tab);
  }

  public get ActiveTabEnum(): typeof ActiveTabEnum {
    return ActiveTabEnum;
  }
}
