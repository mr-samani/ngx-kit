import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { DataService, UserDto } from './data.service';
import { AvatarCellRenderer } from '@demo/shared/renderers/AvatarCellRenderer';
import { BooleanCellRenderer } from '@demo/shared/renderers/BooleanCellRenderer';
import { DateCellRenderer } from '@demo/shared/renderers/DateCellRenderer';
import { RolesCellRenderer } from '@demo/shared/renderers/RolesCellRenderer';
import { StatusCellRenderer } from '@demo/shared/renderers/StatusCellRenderer';
import {
  defineFields,
  defineRenderers,
  LazyLoadEvent,
  NgxPagination,
  NgxTable,
  TableCell,
} from 'ngx-kit/data-table';

/**
 * همین آبجکت باید عیناً در provideTable({ renderers }) هم استفاده شود (نگاه
 * کنید به app.config.ts) — همان چیزی که کلید اتصال type-safety است.
 */
export const renderers = defineRenderers({
  avatar: AvatarCellRenderer,
  boolean: BooleanCellRenderer,
  status: StatusCellRenderer,
  roles: RolesCellRenderer,
  date: DateCellRenderer,
});

const fields = defineFields<UserDto, typeof renderers>(renderers, [
  {
    column: 'avatarUrl',
    title: 'کاربر',
    renderer: 'avatar',
    width: 220,
    rendererInputs: { nameField: 'fullName', showName: true }, // ✅ کاملاً چک‌شده
  },
  { column: 'userName', title: 'نام کاربری', width: 160, sortable: true },
  { column: 'email', title: 'ایمیل', width: 230, sortable: true, formatter: 'emptyDash' },
  { column: 'isActive', title: 'فعال', renderer: 'boolean', width: 90, sortable: true },
  { column: 'status', title: 'وضعیت', renderer: 'status', width: 120, sortable: true },
  { column: 'roles', title: 'نقش‌ها', renderer: 'roles', width: 240, wrap: true },
  {
    column: 'createdAt',
    title: 'تاریخ ایجاد',
    renderer: 'date',
    width: 170,
    sortable: true,
    rendererInputs: { format: 'yyyy/MM/dd HH:mm' },
  },

  // این خطوط را باز کنید تا خطاهای Compile-time واقعی را ببینید — این‌ها
  // دقیقاً همان کلاس‌های باگی هستند که در نسخه‌ی قبلی سایلنت fail می‌شدند:

  // { column: 'fullNmae', title: 'X' },
  // ❌ TS2322: 'fullNmae' در UserDto وجود ندارد (تایپو روی fullName)

  // { column: 'status', title: 'X', renderer: 'sttaus' },
  // ❌ TS2322: 'sttaus' کلید رجیستری renderers نیست

  // { column: 'isActive', title: 'X', renderer: 'boolean', rendererInputs: { foo: 1 } },
  // ❌ TS2353: BooleanCellRenderer ورودی اضافه‌ای به‌نام foo ندارد

  // { column: 'avatarUrl', title: 'X', renderer: 'avatar', rendererInputs: { showName: 'yes' } },
  // ❌ TS2322: showName باید boolean باشد، نه string
]);

@Component({
  selector: 'app-demo-table',
  standalone: true,
  templateUrl: './demo-table.html',
  styleUrls: ['./demo-table.scss'],
  imports: [NgxTable, TableCell],
  providers: [DataService],
})
export class DemoTable {
  private readonly service = inject(DataService);

  protected readonly fields = fields;
  protected readonly loading = signal(false);
  protected readonly rows = signal<UserDto[]>([]);
  protected readonly total = signal(0);

  constructor() {
    this.fetch({ pageIndex: 1, pageSize: 10, first: 0, sorts: [] });
  }

  protected onLazyLoad(event: LazyLoadEvent<UserDto>): void {
    this.fetch(event);
  }

  private fetch(event: LazyLoadEvent<UserDto>): void {
    this.loading.set(true);
    this.service
      .getUsers({
        skipCount: event.first,
        maxResultCount: event.pageSize,
        sorting: event.sorts.map((s) => `${s.field} ${s.direction}`).join(','),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result) => {
        this.rows.set(result.items);
        this.total.set(result.totalCount);
      });
  }
}
