import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CellRendererComponent, TableFieldBase } from 'ngx-kit/data-table';

@Component({
  selector: 'app-avatar-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user">
      @if (value()) {
        <img class="avatar" [src]="value()!" [alt]="displayName()" />
      } @else {
        <span class="avatar avatar--fallback">{{ initials() }}</span>
      }
      @if (showName()) {
        <span class="user-name">{{ displayName() }}</span>
      }
    </div>
  `,
  styles: `
    .user {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar--fallback {
      color: #1e3a8a;
      background: #dbeafe;
      font-size: 13px;
      font-weight: 600;
    }
    .user-name {
      white-space: nowrap;
    }
  `,
})
export class AvatarCellRenderer<T extends object> implements CellRendererComponent<
  string | null,
  T
> {
  readonly value = input.required<string | null>();
  readonly row = input.required<T>();
  readonly field = input.required<TableFieldBase<T>>();

  // این دو ورودی اضافه به‌صورت خودکار در rendererInputs همان ستون در
  // defineFields(...) قابل تنظیم و type-check می‌شوند.
  readonly nameField = input('fullName');
  readonly showName = input(true);

  // مهم: چون این‌ها computed داخلی هستند نه ورودی، protected شده‌اند تا در
  // استخراج rendererInputs (که فقط از روی امضای callable تشخیص می‌دهد)
  // اشتباهاً به‌عنوان یک ورودی قابل تنظیم دیده نشوند.
  protected readonly displayName = computed(() => {
    const field = this.nameField();
    const value = (this.row() as Record<string, unknown>)[field];
    return value == null ? '' : String(value);
  });

  protected readonly initials = computed(() => {
    const name = this.displayName().trim();
    if (!name) return '?';
    const parts = name.split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  });
}
