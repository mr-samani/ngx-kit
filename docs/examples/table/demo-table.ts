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
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

/**
 * This exact object must also be used in provideTable({ renderers }) (see
 * app.config.ts) — that's what wires up the type-safety.
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
    title: 'User',
    renderer: 'avatar',
    width: 220,
    rendererInputs: { nameField: 'fullName', showName: true }, // ✅ fully type-checked
  },
  { column: 'userName', title: 'Username', sortable: true },
  { column: 'email', title: 'Email', width: 230, sortable: true, formatter: 'emptyDash' },
  { column: 'isActive', title: 'Active', renderer: 'boolean', width: 90, sortable: true },
  { column: 'status', title: 'Status', renderer: 'status', width: 120, sortable: true },
  { column: 'roles', title: 'Roles', renderer: 'roles', width: 240, wrap: true },
  {
    column: 'createdAt',
    title: 'Created At',
    renderer: 'date',
    width: 170,
    sortable: true,
    rendererInputs: { format: 'yyyy/MM/dd HH:mm' },
  },

  // Uncomment these to see real compile-time errors — these are exactly the
  // kind of buggy definitions that used to fail silently in older versions:

  // { column: 'fullNmae', title: 'X' },
  // ❌ TS2322: 'fullNmae' does not exist on UserDto (typo for fullName)

  // { column: 'status', title: 'X', renderer: 'sttaus' },
  // ❌ TS2322: 'sttaus' is not a key of the renderers registry

  // { column: 'isActive', title: 'X', renderer: 'boolean', rendererInputs: { foo: 1 } },
  // ❌ TS2353: BooleanCellRenderer has no input named foo

  // { column: 'avatarUrl', title: 'X', renderer: 'avatar', rendererInputs: { showName: 'yes' } },
  // ❌ TS2322: showName must be boolean, not string
]);

@Component({
  selector: 'app-demo-table',
  standalone: true,
  templateUrl: './demo-table.html',
  styleUrls: ['./demo-table.scss'],
  imports: [NgxTable, TableCell, ExampleShowcaseComponent],
  providers: [DataService],
})
export class DemoTable {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/table/demo-table.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/table/demo-table.html', language: 'html' },
  ];

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
        sorting: event.sorts?.map((s) => `${s.field} ${s.direction}`).join(','),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result) => {
        this.rows.set(result.items);
        this.total.set(result.totalCount);
      });
  }
}
