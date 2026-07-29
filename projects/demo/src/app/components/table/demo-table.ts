import { Component, inject, signal } from '@angular/core';

import { FieldsType, LazyLoadEvent, NgxPagination, NgxTable } from 'ngx-kit/data-table';
import { DataService, UserDto } from './data.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-demo-table',
  templateUrl: './demo-table.html',
  styleUrls: ['./demo-table.scss'],
  imports: [NgxPagination, NgxTable],
  providers: [DataService],
})
export class DemoTable {
  private readonly service = inject(DataService);
  fields: FieldsType<UserDto>[] = [
    {
      column: 'avatarUrl',
      title: 'کاربر',
      renderer: 'avatar',
      width: 220,
      rendererInputs: {
        nameField: 'fullName',
        showName: true,
      },
    },
    {
      column: 'userName',
      title: 'نام کاربری',
      width: 160,
    },
    {
      column: 'email',
      title: 'ایمیل',
      formatter: 'emptyDash',
      width: 230,
    },
    {
      column: 'isActive',
      title: 'فعال',
      renderer: 'boolean',
      width: 90,
    },
    {
      column: 'status',
      title: 'وضعیت',
      renderer: 'status',
      width: 120,
    },
    {
      column: 'roles',
      title: 'نقش‌ها',
      renderer: 'roles',
      width: 240,
      wrap: true,
    },
    {
      column: 'createdAt',
      title: 'تاریخ ایجاد',
      renderer: 'date',
      width: 170,
      rendererInputs: {
        format: 'yyyy/MM/dd HH:mm',
      },
    },
  ];
  loading = signal(false);
  rows = signal<UserDto[]>([]);
  total = signal(0);
  constructor() {}

  /**
   * localize
   */
  l(key: string) {
    return key;
  }

  getData(event: LazyLoadEvent<UserDto>): void {
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
