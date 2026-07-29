import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldsType, TableCellRendererComponent } from 'ngx-kit/data-table';

type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending';

@Component({
  selector: 'app-status-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="status"
      [class.status--active]="value() === 'active'"
      [class.status--inactive]="value() === 'inactive'"
      [class.status--blocked]="value() === 'blocked'"
      [class.status--pending]="value() === 'pending'">
      {{ label() }}
    </span>
  `,
  styles: `
    .status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 70px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status--active {
      color: #166534;
      background: #dcfce7;
    }

    .status--inactive {
      color: #374151;
      background: #f3f4f6;
    }

    .status--blocked {
      color: #991b1b;
      background: #fee2e2;
    }

    .status--pending {
      color: #92400e;
      background: #fef3c7;
    }
  `,
})
export class StatusCellRenderer<T extends object> implements TableCellRendererComponent<
  UserStatus,
  T
> {
  readonly value = input.required<UserStatus>();
  readonly row = input.required<T>();
  readonly field = input.required<FieldsType<T>>();

  readonly label = computed(() => {
    const labels: Record<UserStatus, string> = {
      active: 'فعال',
      inactive: 'غیرفعال',
      blocked: 'مسدود',
      pending: 'در انتظار',
    };

    return labels[this.value()] ?? this.value();
  });
}
