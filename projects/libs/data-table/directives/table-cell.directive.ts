import { Directive, inject, input, TemplateRef } from '@angular/core';
import { CellTemplateContext } from '../types/table-field.types';

/**
 * برای projection قالب سفارشی یک ستون بدون این‌که مجبور باشید cellTemplate را
 * از طریق ViewChild به آبجکت ستون وصل کنید:
 *
 *   <ngx-table [fields]="fields" [data]="rows()">
 *     <ng-template ngxTableCell="userName" let-row let-value="value">
 *       <strong>{{ value }}</strong>
 *     </ng-template>
 *   </ngx-table>
 *
 * مهم: چون این دایرکتیو در تمپلیت *کامپوننت مصرف‌کننده* (نه ngx-table) استفاده
 * می‌شود، باید آن را در آرایه‌ی imports همان کامپوننت (standalone) وارد کنید:
 *   imports: [NgxTable, TableCell]
 *
 * محدودیت شناخته‌شده: context این تمپلیت (row/value) از نوع T دقیق نیست
 * (چون TemplateRef اینجا به‌صورت پویا از ContentChildren جمع‌آوری می‌شود و
 * اطلاعات جنریک T در آن نقطه از بین می‌رود). برای type-safety کامل روی
 * row/value، از field.cellTemplate به همراه @ViewChild استفاده کنید (به README
 * بخش «Cell Template کاملاً Type-Safe» مراجعه کنید).
 */
@Directive({
  selector: 'ng-template[ngxTableCell]',
  standalone: true,
})
export class TableCell<T extends object = object> {
  readonly column = input.required<string>({ alias: 'ngxTableCell' });
  readonly templateRef = inject(TemplateRef<CellTemplateContext<T>>);
}
