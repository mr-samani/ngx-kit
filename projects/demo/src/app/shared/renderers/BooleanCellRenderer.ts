import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellRendererComponent, TableFieldBase } from 'ngx-kit/data-table';

@Component({
  selector: 'app-boolean-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="boolean-badge"
      [class.boolean-badge--yes]="value()"
      [class.boolean-badge--no]="!value()">
      {{ value() ? 'بله' : 'خیر' }}
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .boolean-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .boolean-badge--yes {
      color: #166534;
      background: #dcfce7;
    }
    .boolean-badge--no {
      color: #991b1b;
      background: #fee2e2;
    }
  `,
})
export class BooleanCellRenderer<T extends object> implements CellRendererComponent<boolean, T> {
  readonly value = input.required<boolean>();
  readonly row = input.required<T>();
  readonly field = input.required<TableFieldBase<T>>();
}
