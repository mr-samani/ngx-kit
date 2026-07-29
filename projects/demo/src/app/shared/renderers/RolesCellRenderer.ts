import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldsType, TableCellRendererComponent } from 'ngx-kit/data-table';

@Component({
  selector: 'app-roles-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="roles">
      @for (role of value(); track role) {
        <span class="role">
          {{ role }}
        </span>
      } @empty {
        <span class="empty">بدون نقش</span>
      }
    </div>
  `,
  styles: `
    .roles {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .role {
      padding: 3px 7px;
      border-radius: 4px;
      background: #f3f4f638;
      font-size: 11px;
      white-space: nowrap;
    }

    .empty {
      opacity: 0.5;
    }
  `,
})
export class RolesCellRenderer<T extends object> implements TableCellRendererComponent<
  string[],
  T
> {
  readonly value = input.required<string[]>();
  readonly row = input.required<T>();
  readonly field = input.required<FieldsType<T>>();
}
