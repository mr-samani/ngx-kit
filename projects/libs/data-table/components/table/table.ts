import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  QueryList,
  signal,
  TemplateRef,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableCell } from '../../directives/table-cell.directive';
import { ColumnResize } from '../../directives/column-resize.directive';
import { NGX_TABLE_CONFIG, NGX_TABLE_I18N } from '../../tokens/table-config.token';
import { NGX_PAGINATION_CONFIG } from '../../tokens/pagination-config.token';
import { PageEvent, LazyLoadEvent } from '../../types/page.types';
import { SortDirection, SortMeta } from '../../types/sort.types';
import {
  CellRendererComponent,
  CellTemplateContext,
  TableField,
} from '../../types/table-field.types';
import { NgxPagination } from '../pagination/pagination';
import { DirectionService } from 'ngx-kit/core';
import type { ColumnFilterState } from '../../types/filter.type';
import { ColumnFilterService } from '../../services/column-filter.service';
import { NgxColumnFilter } from '../column-filter/column-filter';

@Component({
  selector: 'ngx-table',
  standalone: true,
  templateUrl: './table.html',
  styleUrl: './table.scss',
  imports: [CommonModule, NgxPagination, ColumnResize, NgxColumnFilter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-table-host',
    '[style.--ngx-table-scroll-height]': 'height()',
  },
})
export class NgxTable<T extends object> implements OnInit, AfterContentInit {
  protected readonly config = inject(NGX_TABLE_CONFIG);
  protected readonly labels = inject(NGX_TABLE_I18N);
  protected readonly paginationConfig = inject(NGX_PAGINATION_CONFIG);
  protected readonly columnFilterService = inject(ColumnFilterService);

  // ---------------------------------------------------------------- inputs
  readonly fields = input.required<TableField<T, any>[]>();
  readonly data = input.required<readonly T[]>();
  readonly totalRecords = input.required<number>();
  readonly showRecordNumber = input(this.config.showRecordNumber);
  readonly operations = input<TemplateRef<{ $implicit: T }>>();
  readonly operationWidth = input(80);
  readonly numWidth = input(80);
  readonly pageSize = input(this.paginationConfig.defaultPageSize);
  readonly page = input(1);
  readonly pageChange = output<number>();
  readonly loading = input(false);
  readonly multiSort = input<boolean | undefined>(undefined);
  readonly lazy = input(this.config.lazy);
  readonly resizable = input(this.config.resizable);
  readonly height = input<string>('75dvh');
  readonly trackBy = input<(index: number, row: T) => unknown>((index) => index);

  // --------------------------------------------------------------- outputs
  readonly lazyLoad = output<LazyLoadEvent<T>>();
  readonly sortChange = output<SortMeta<T>[]>();
  readonly columnResize = output<{ field: string; width: number }>();
  readonly filterChange = output<ColumnFilterState[]>();

  // ------------------------------------------------------------ int. state
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly pageIndex = signal(1);
  protected readonly pageSizeS = signal(this.paginationConfig.defaultPageSize);
  protected readonly sorts = signal<SortMeta<T>[]>([]);
  protected readonly widths = signal<Record<string, number>>({});
  protected readonly activeFilters = signal<Record<string, ColumnFilterState>>({});
  private readonly manuallyResized = new Set<string>();
  private readonly rendererInputsCache = new Map<
    TableField<T, any>,
    WeakMap<T, Record<string, unknown>>
  >();

  @ContentChildren(TableCell) private cellTemplates!: QueryList<TableCell<T>>;
  private templateMap = new Map<string, TemplateRef<CellTemplateContext<T>>>();

  protected readonly resolvedMultiSort = computed(() => this.multiSort() ?? this.config.multiSort);
  private readonly directionService = inject(DirectionService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly resolvedDirection = computed(() => this.directionService.direction());

  constructor() {
    effect(() => {
      this.pageSizeS.set(this.pageSize());
      this.pageIndex.set(this.page());
    });

    effect(() => {
      const cols = this.fields();
      const current = this.widths();
      let changed = false;
      const next = { ...current };
      for (const f of cols) {
        if (this.manuallyResized.has(f.column)) continue;
        if (f.column in next) continue;
        if (typeof f.width === 'number') {
          next[f.column] = f.width;
          changed = true;
        }
      }
      if (changed) this.widths.set(next);
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.syncTemplateMap();
    this.cellTemplates.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncTemplateMap());
  }

  private syncTemplateMap(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach((cell) => {
      this.templateMap.set(cell.column(), cell.templateRef);
    });
  }

  // ------------------------------------------------------------- داده‌ها (فیلتر ➔ سورت ➔ صفحه‌بندی)
  protected readonly filteredData = computed<readonly T[]>(() => {
    const raw = this.data();
    if (this.lazy()) return raw;
    return this.columnFilterService.applyFilters(raw, this.activeFilters());
  });

  protected readonly sortedData = computed<readonly T[]>(() => {
    const source = this.filteredData();
    if (this.lazy()) return source;
    const sorts = this.sorts();
    if (sorts.length === 0) return source;
    const copy = [...source];
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
    this.lazy() ? this.totalRecords() : this.filteredData().length,
  );

  protected readonly pagedData = computed<readonly T[]>(() => {
    if (this.lazy()) return this.sortedData();
    const start = (this.pageIndex() - 1) * this.pageSizeS();
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

  protected recordNumber(rowIndex: number): number {
    return (this.pageIndex() - 1) * this.pageSizeS() + rowIndex + 1;
  }

  // -------------------------------------------------------------- سورت
  protected sortDirectionFor(column: string): SortDirection | null {
    return this.sorts().find((s) => s.field === column)?.direction ?? null;
  }

  protected onHeaderClick(field: TableField<T, any>, event: MouseEvent): void {
    if (field.sortable === false) return;
    const column = field.column;
    const current = this.sorts();
    const existingIndex = current.findIndex((s) => s.field === column);
    const isMultiGesture =
      this.resolvedMultiSort() && (event.shiftKey || event.ctrlKey || event.metaKey);

    let next: SortMeta<T>[];
    if (isMultiGesture) {
      next = [...current];
      if (existingIndex === -1) {
        next.push({ field: column, direction: 'asc' });
      } else if (next[existingIndex].direction === 'asc') {
        next[existingIndex] = { field: column, direction: 'desc' };
      } else {
        next.splice(existingIndex, 1);
      }
    } else if (existingIndex === -1 || current.length > 1) {
      next = [{ field: column, direction: 'asc' }];
    } else if (current[0].direction === 'asc') {
      next = [{ field: column, direction: 'desc' }];
    } else {
      next = [];
    }

    this.sorts.set(next);
    this.pageIndex.set(1);
    this.pageChange.emit(this.pageIndex());
    this.sortChange.emit(next);
    this.emitLazyIfNeeded();
  }

  // ------------------------------------------------------------ فیلتر
  protected isFilterable(field: TableField<T, any>): boolean {
    return field.filterable === true || !!field.filterConfig?.enabled;
  }

  protected getFilterState(column: string): ColumnFilterState | null {
    const f = this.activeFilters()[column];
    return this.columnFilterService.isFilterActive(f) ? f : null;
  }

  protected getDistinctValues(column: string): unknown[] {
    const raw = this.data();
    if (!raw || raw.length === 0) return [];
    return Array.from(new Set(raw.map((r: any) => r[column])));
  }

  protected onFilterApply(state: ColumnFilterState): void {
    this.activeFilters.update((prev) => ({ ...prev, [state.field]: state }));
    this.pageIndex.set(1);
    this.pageChange.emit(1);

    const activeList = Object.values(this.activeFilters()).filter((f) =>
      this.columnFilterService.isFilterActive(f),
    );
    this.filterChange.emit(activeList);
    this.emitLazyIfNeeded();
  }

  protected onFilterClear(field: string): void {
    this.activeFilters.update((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    this.pageIndex.set(1);
    this.pageChange.emit(1);

    const activeList = Object.values(this.activeFilters()).filter((f) =>
      this.columnFilterService.isFilterActive(f),
    );
    this.filterChange.emit(activeList);
    this.emitLazyIfNeeded();
  }

  // ------------------------------------------------------------ صفحه‌بندی
  protected onPaginate(event: PageEvent): void {
    this.pageIndex.set(event.page);
    this.pageSizeS.set(event.pageSize);
    this.pageChange.emit(this.pageIndex());
    this.emitLazyIfNeeded();
  }

  private emitLazyIfNeeded(): void {
    if (!this.lazy()) return;
    const pageIndex = this.pageIndex();
    const pageSize = this.pageSizeS();
    const activeFilterList = Object.values(this.activeFilters()).filter((f) =>
      this.columnFilterService.isFilterActive(f),
    );
    this.lazyLoad.emit({
      pageIndex,
      pageSize,
      first: (pageIndex - 1) * pageSize,
      sorts: this.sorts(),
      sorting: this.sorts()
        ?.map((s) => `${s.field} ${s.direction}`)
        .join(','),
      filters: activeFilterList,
    });
  }

  // -------------------------------------------------------------- ریسایز
  protected columnWidth(column: string): number {
    return this.widths()[column] ?? this.config.column.defaultWidth;
  }

  protected columnFlex(field: TableField<T, any>): string {
    const resized = this.widths()[field.column];
    if (resized != null) return `0 0 ${resized}px`;
    if (typeof field.width === 'string') return `0 0 ${field.width}`;
    return '1 1 0';
  }

  protected columnMin(field: TableField<T, any>): number {
    return field.minWidth ?? this.config.column.minWidth;
  }

  protected columnMax(field: TableField<T, any>): number {
    return field.maxWidth ?? this.config.column.maxWidth;
  }

  protected isResizable(field: TableField<T, any>): boolean {
    return (field.resizable ?? this.resizable()) !== false;
  }

  protected onColumnResizing(column: string, width: number): void {
    this.widths.update((w) => ({ ...w, [column]: width }));
  }

  protected onColumnResizeEnd(column: string, width: number): void {
    this.manuallyResized.add(column);
    this.widths.update((w) => ({ ...w, [column]: width }));
    this.columnResize.emit({ field: column, width });
  }

  // --------------------------------------------------------------- سلول‌ها
  protected getTemplate(column: string): TemplateRef<CellTemplateContext<T>> | null {
    const fromDirective = this.templateMap.get(column);
    if (fromDirective) return fromDirective;
    const fromFieldConfig = this.fields().find((f) => f.column === column)?.cellTemplate;
    return fromFieldConfig ?? null;
  }

  protected getRenderer(field: TableField<T, any>): Type<CellRendererComponent> | null {
    if (!field.renderer) return null;
    return this.config.renderers[field.renderer as string] ?? null;
  }

  protected getCellValue(row: T, field: TableField<T, any>): unknown {
    return row[field.column];
  }

  protected formatCellValue(row: T, field: TableField<T, any>): string {
    const value = this.getCellValue(row, field);
    if (typeof field.formatter === 'function') {
      return this.stringify(field.formatter(value, row, field));
    }
    if (typeof field.formatter === 'string') {
      const formatter = this.config.formatters[field.formatter];
      if (formatter) return this.stringify(formatter(value, row, field));
    }
    return this.stringify(value);
  }

  private stringify(value: unknown): string {
    return value == null ? '' : String(value);
  }

  protected getRendererInputs(row: T, field: TableField<T, any>): Record<string, unknown> {
    let fieldCache = this.rendererInputsCache.get(field);
    if (!fieldCache) {
      fieldCache = new WeakMap();
      this.rendererInputsCache.set(field, fieldCache);
    }
    let inputs = fieldCache.get(row);
    if (!inputs) {
      inputs = {
        value: this.getCellValue(row, field),
        row,
        field,
        ...(field.renderer ? field.rendererInputs : undefined),
      };
      fieldCache.set(row, inputs);
    }
    return inputs;
  }
}
