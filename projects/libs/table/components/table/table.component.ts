import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  TrackByFunction,
} from '@angular/core';
import { TableColumn } from '../../types/column.types';
import { LazyLoadEvent, PageState, SortDirection, SortMeta } from '../../types/table.types';
import { NGX_TABLE_CONFIG } from '../../tokens/table-config.token';
import { ColumnResizeDirective } from '../../directives/column-resize.directive';
import { NgxTablePaginatorComponent } from '../paginator/paginator.component';

/**
 * Generic, type-safe data table.
 *
 * `T` is inferred from whatever you bind to [data] / [columns], so
 * `row.someField` inside a cell template — and every `column.field` in your
 * TS column definitions — is checked against your actual model. Rename or
 * remove a property on T and the build breaks at the exact call site.
 *
 * Two operating modes:
 *  - client-side (default): pass the full array in [data]; sorting and
 *    pagination happen locally.
 *  - lazy (server-side): set [lazy]="true" and [totalRecords], and listen to
 *    (lazyLoad) to fetch the current page/sort from your API. [data] should
 *    then contain only the current page.
 */
@Component({
  selector: 'ngx-table',
  imports: [CommonModule, ColumnResizeDirective, NgxTablePaginatorComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-table-host',
  },
})
export class NgxTableComponent<T extends object> {
  protected readonly config = inject(NGX_TABLE_CONFIG);

  // ---------------------------------------------------------------- inputs
  readonly data = input<readonly T[]>([]);
  readonly columns = input.required<TableColumn<T>[]>();
  readonly loading = input(false);
  readonly lazy = input(false);
  readonly totalRecords = input(0);
  readonly trackBy = input<TrackByFunction<T>>((index: number) => index);
  readonly multiSort = input<boolean | undefined>(undefined);
  readonly pageSize = input<number | undefined>(undefined);
  readonly pageSizeOptions = input<number[] | undefined>(undefined);
  readonly paginator = input(true);
  readonly emptyMessage = input<string | undefined>(undefined);

  // --------------------------------------------------------------- outputs
  readonly lazyLoad = output<LazyLoadEvent<T>>();
  readonly sortChange = output<SortMeta<T>[]>();
  readonly pageChange = output<PageState>();
  readonly columnResize = output<{ field: string; width: number }>();

  // ------------------------------------------------------------ int. state
  protected readonly sorts = signal<SortMeta<T>[]>([]);
  protected readonly pageIndexS = signal(0);
  protected readonly pageSizeS = signal(this.config.pagination.defaultPageSize);
  protected readonly widths = signal<Record<string, number>>({});
  private readonly manuallyResized = new Set<string>();

  protected readonly resolvedMultiSort = computed(() => this.multiSort() ?? this.config.multiSort);
  protected readonly resolvedPageSizeOptions = computed(
    () => this.pageSizeOptions() ?? this.config.pagination.pageSizeOptions,
  );
  protected readonly visibleColumns = computed(() =>
    this.columns().filter((c) => c.visible !== false),
  );
  protected readonly locale = this.config.locale;

  constructor() {
    // Sync the initial/explicit page size input into internal state.
    effect(() => {
      const ps = this.pageSize();
      if (ps) this.pageSizeS.set(ps);
    });

    // Seed a width for every column the first time it's seen. Columns the
    // user has already dragged manually are never touched again, even if
    // the [columns] array reference changes (e.g. new data arrives).
    effect(() => {
      const cols = this.columns();
      const current = this.widths();
      let changed = false;
      const next = { ...current };
      for (const col of cols) {
        if (!(col.field in next) && !this.manuallyResized.has(col.field)) {
          next[col.field] = col.width ?? this.config.column.defaultWidth;
          changed = true;
        }
      }
      if (changed) this.widths.set(next);
    });
  }

  protected readonly sortedData = computed<readonly T[]>(() => {
    if (this.lazy()) return this.data();
    const sorts = this.sorts();
    if (sorts.length === 0) return this.data();
    const copy = [...this.data()];
    copy.sort((a, b) => {
      for (const s of sorts) {
        const cmp = this.compare(a[s.field], b[s.field]);
        if (cmp !== 0) return s.direction === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
    return copy;
  });

  protected readonly totalCount = computed(() =>
    this.lazy() ? this.totalRecords() : this.data().length,
  );

  protected readonly pagedData = computed<readonly T[]>(() => {
    if (this.lazy() || !this.paginator()) return this.sortedData();
    const start = this.pageIndexS() * this.pageSizeS();
    return this.sortedData().slice(start, start + this.pageSizeS());
  });

  private compare(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? 1 : -1;
    if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
    return String(a).localeCompare(String(b));
  }

  protected columnWidth(field: string): number {
    return this.widths()[field] ?? this.config.column.defaultWidth;
  }

  protected columnMin(col: TableColumn<T>): number {
    return col.minWidth ?? this.config.column.minWidth;
  }

  protected columnMax(col: TableColumn<T>): number {
    return col.maxWidth ?? this.config.column.maxWidth;
  }

  protected onColumnResizing(field: string, width: number): void {
    this.widths.update((w) => ({ ...w, [field]: width }));
  }

  protected onColumnResizeEnd(field: string, width: number): void {
    this.manuallyResized.add(field);
    this.widths.update((w) => ({ ...w, [field]: width }));
    this.columnResize.emit({ field, width });
  }

  protected sortDirectionFor(field: string): SortDirection | null {
    return this.sorts().find((s) => s.field === field)?.direction ?? null;
  }

  protected onHeaderClick(col: TableColumn<T>, event: MouseEvent): void {
    if (!col.sortable) return;
    const field = col.field;
    const current = this.sorts();
    const existingIndex = current.findIndex((s) => s.field === field);
    const isMultiGesture =
      this.resolvedMultiSort() && (event.shiftKey || event.ctrlKey || event.metaKey);

    let next: SortMeta<T>[];
    if (isMultiGesture) {
      next = [...current];
      if (existingIndex === -1) {
        next.push({ field, direction: 'asc' });
      } else if (next[existingIndex].direction === 'asc') {
        next[existingIndex] = { field, direction: 'desc' };
      } else {
        next.splice(existingIndex, 1);
      }
    } else if (existingIndex === -1 || current.length > 1) {
      next = [{ field, direction: 'asc' }];
    } else if (current[0].direction === 'asc') {
      next = [{ field, direction: 'desc' }];
    } else {
      next = [];
    }

    this.sorts.set(next);
    this.pageIndexS.set(0);
    this.sortChange.emit(next);
    this.emitLazyIfNeeded();
  }

  protected onPageIndexChange(index: number): void {
    this.pageIndexS.set(index);
    this.emitPageAndLazy();
  }

  protected onPageSizeChange(size: number): void {
    this.pageSizeS.set(size);
    this.pageIndexS.set(0);
    this.emitPageAndLazy();
  }

  private emitPageAndLazy(): void {
    this.pageChange.emit(this.currentPageState());
    this.emitLazyIfNeeded();
  }

  private currentPageState(): PageState {
    const pageIndex = this.pageIndexS();
    const pageSize = this.pageSizeS();
    return { pageIndex, pageSize, first: pageIndex * pageSize };
  }

  private emitLazyIfNeeded(): void {
    if (!this.lazy()) return;
    this.lazyLoad.emit({ ...this.currentPageState(), sorts: this.sorts() });
  }

  protected cellValue(row: T, col: TableColumn<T>): string {
    if (col.format) return col.format(row);
    const value = row[col.field];
    return value == null ? '' : String(value);
  }
}
