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
    { column: 'fullName', title: this.l('Name') },
    { column: 'userName', title: this.l('UserName') },
    { column: 'email', title: this.l('Email') },
    { column: 'roles', title: this.l('Roles') },
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
