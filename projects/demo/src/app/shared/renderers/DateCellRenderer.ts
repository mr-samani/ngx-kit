import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellRendererComponent, TableFieldBase } from 'ngx-kit/data-table';

@Component({
  selector: 'app-date-cell',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (value()) {
      <span class="date-value">{{ value() | date: format() }}</span>
    } @else {
      <span class="empty-value">—</span>
    }
  `,
  styles: `
    .date-value {
      direction: ltr;
      display: inline-block;
      white-space: nowrap;
    }
    .empty-value {
      opacity: 0.5;
    }
  `,
})
export class DateCellRenderer<T extends object> implements CellRendererComponent<
  string | Date | null,
  T
> {
  readonly value = input.required<string | Date | null>();
  readonly row = input.required<T>();
  readonly field = input.required<TableFieldBase<T>>();

  readonly format = input('yyyy/MM/dd HH:mm');
}
