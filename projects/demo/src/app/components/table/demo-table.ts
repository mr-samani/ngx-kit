import { Component, inject } from '@angular/core';

import { NgxPagination } from 'ngx-kit/data-table';

@Component({
  selector: 'app-demo-table',
  templateUrl: './demo-table.html',
  styleUrls: ['./demo-table.scss'],
  imports: [NgxPagination],
  providers: [],
})
export class DemoTable {
  //private readonly tenantsService = inject(TenantsService);

  constructor() {
    // this.fetchPage({ pageIndex: 0, pageSize: 10, first: 0, sorts: [] });
  }

  // protected onLazyLoad(event: LazyLoadEvent<Tenant>): void {
  //   this.fetchPage(event);
  // }

  // private fetchPage(event: LazyLoadEvent<Tenant>): void {
  //   this.loading.set(true);
  //   this.tenantsService
  //     .getTenants({
  //       skipCount: event.first,
  //       maxResultCount: event.pageSize,
  //       sorting: event.sorts.map((s) => `${s.field} ${s.direction}`).join(','),
  //     })
  //     .subscribe((result) => {
  //       this.rows.set(result.items);
  //       this.total.set(result.totalCount);
  //       this.loading.set(false);
  //     });
  // }
}
