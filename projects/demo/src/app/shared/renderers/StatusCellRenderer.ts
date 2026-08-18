import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CellRendererComponent, TableFieldBase } from 'ngx-kit/data-table';

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending';

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
      color: #fff;
    }
    .status--active {
      background: #166534;
    }
    .status--inactive {
      background: #374151;
    }
    .status--blocked {
      background: #991b1b;
    }
    .status--pending {
      background: #92400e;
    }
  `,
})
export class StatusCellRenderer<T extends object> implements CellRendererComponent<UserStatus, T> {
  readonly value = input.required<UserStatus>();
  readonly row = input.required<T>();
  readonly field = input.required<TableFieldBase<T>>();

  protected readonly label = computed(() => {
    const labels: Record<UserStatus, string> = {
      active: 'Active',
      inactive: 'Inactive',
      blocked: 'Blocked',
      pending: 'Pending',
    };
    return labels[this.value()] ?? this.value();
  });
}
