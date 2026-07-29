import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal } from '@angular/core';
import {
  CellContext,
  defineColumns,
  LazyLoadEvent,
  NgxTableComponent,
  TableColumn,
} from 'ngx-kit/table';
import { Tenant } from './tenants.model';
import { TenantsService } from './tenants.service'; // your own HttpClient wrapper

/**
 * Client-side columns. `field:` only accepts a real key of Tenant.
 * Try renaming `tenancyName` in tenants.model.ts — this array (and the
 * cell template below) will no longer compile until you fix it.
 */
const tenantColumns: TableColumn<Tenant>[] = defineColumns<Tenant>([
  { field: 'tenancyName', header: 'Tenancy Name', sortable: true, minWidth: 140 },
  { field: 'name', header: 'Tenant Name', sortable: true },
  { field: 'editionDisplayName', header: 'Edition' },
  {
    field: 'subscriptionEndDateUtc',
    header: 'Subscription End',
    sortable: true,
    format: (row) =>
      row.subscriptionEndDateUtc ? new Date(row.subscriptionEndDateUtc).toLocaleDateString() : '-',
  },
  { field: 'isActive', header: 'Active', sortable: true, align: 'center', width: 110 },
  {
    field: 'creationTime',
    header: 'Creation Time',
    sortable: true,
    format: (row) => new Date(row.creationTime).toLocaleString(),
  },
]);

@Component({
  selector: 'app-tenants-table',
  imports: [NgxTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngx-table
      [data]="rows()"
      [columns]="columns"
      [lazy]="true"
      [loading]="loading()"
      [totalRecords]="total()"
      [multiSort]="true"
      (lazyLoad)="onLazyLoad($event)"></ngx-table>

    <!--
      A custom cell template for the "isActive" column. \`ctx.$implicit\` is
      typed as Tenant — \`ctx.$implicit.isActive\` autocompletes and is
      type-checked exactly like everywhere else.
    -->
    <ng-template #activeCell let-row>
      <span class="badge" [class.badge--on]="row.isActive" [class.badge--off]="!row.isActive">
        {{ row.isActive ? 'Yes' : 'No' }}
      </span>
    </ng-template>
  `,
})
export class DemoTable {
  private readonly tenantsService = new TenantsService(); // inject() in a real app

  protected readonly columns = tenantColumns;
  protected readonly rows = signal<Tenant[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);

  @ViewChild('activeCell', { static: true })
  private set activeCellTpl(tpl: TemplateRef<CellContext<Tenant>>) {
    // Wire the template onto the column once the view is ready.
    const col = tenantColumns.find((c) => c.field === 'isActive');
    if (col) col.cellTemplate = tpl;
  }

  constructor() {
    this.fetchPage({ pageIndex: 0, pageSize: 10, first: 0, sorts: [] });
  }

  protected onLazyLoad(event: LazyLoadEvent<Tenant>): void {
    this.fetchPage(event);
  }

  private fetchPage(event: LazyLoadEvent<Tenant>): void {
    this.loading.set(true);
    this.tenantsService
      .getTenants({
        skipCount: event.first,
        maxResultCount: event.pageSize,
        sorting: event.sorts.map((s) => `${s.field} ${s.direction}`).join(','),
      })
      .subscribe((result) => {
        this.rows.set(result.items);
        this.total.set(result.totalCount);
        this.loading.set(false);
      });
  }
}
