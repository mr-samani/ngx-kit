import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  DOCUMENT,
  effect,
  inject,
  input,
  OnInit,
  output,
  QueryList,
  signal,
  TemplateRef,
  Type,
} from '@angular/core';
import { TableCell } from '../../directives/table-cell.directive';
import { ColumnResize } from '../../directives/column-resize.directive';
import { NGX_TABLE_CONFIG } from '../../tokens/table-config.token';
import { NGX_PAGINATION_CONFIG } from '../../tokens/pagination-config.token';
import { PageEvent, LazyLoadEvent } from '../../types/page.types';
import { SortDirection, SortMeta } from '../../types/sort.types';
import {
  CellRendererComponent,
  CellTemplateContext,
  TableField,
} from '../../types/table-field.types';
import { NgxPagination } from '../pagination/pagination';
import { DirectionService } from 'ngx-kit/shared';

/**
 * جدول داده‌ی جنریک و Type-Safe.
 *
 * `T` از روی چیزی که به [data] بایند می‌کنید استنتاج می‌شود؛ `field.column` در
 * `TableField<T, R>` محدود به `keyof T` است، و اگر از defineFields(renderers, ...)
 * استفاده کنید، `field.renderer` محدود به کلیدهای رجیستری و `rendererInputs`
 * دقیقاً همان ورودی‌های اضافه‌ی همان renderer است.
 *
 * دو حالت:
 *  - کلاینت‌ساید (پیش‌فرض): [data] کل آرایه است؛ سورت/صفحه‌بندی داخلی و روی
 *    یک computed خالص انجام می‌شود (بدون mutation روی آبجکت‌های شما).
 *  - lazy: [lazy]="true" + [totalRecords]؛ [data] فقط صفحه‌ی جاری است؛ به
 *    (lazyLoad) گوش بدهید.
 */
@Component({
  selector: 'ngx-table',
  standalone: true,
  templateUrl: './table.html',
  styleUrl: './table.scss',
  imports: [CommonModule, NgxPagination, ColumnResize],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-table-host',
  },
})
export class NgxTable<T extends object> implements OnInit, AfterContentInit {
  protected readonly config = inject(NGX_TABLE_CONFIG);
  protected readonly paginationConfig = inject(NGX_PAGINATION_CONFIG);

  // ---------------------------------------------------------------- inputs
  readonly fields = input.required<TableField<T, any>[]>();
  readonly data = input.required<readonly T[]>();
  readonly totalRecords = input.required<number>();
  readonly showRecordNumber = input(this.config.showRecordNumber);
  readonly operations = input<TemplateRef<{ $implicit: T }>>();
  readonly operationWidth = input(60);
  readonly numWidth = input(60);
  readonly pageSize = input(this.paginationConfig.defaultPageSize);
  readonly loading = input(false);
  readonly multiSort = input<boolean | undefined>(undefined);
  readonly lazy = input(false);
  /** پیش‌فرض بر اساس ایندکس؛ برای جلوگیری از گم‌شدن state سطرها هنگام سورت،
   *  یک شناسه‌ی یکتا بدهید: [trackBy]="(i, row) => row.id" */
  readonly trackBy = input<(index: number, row: T) => unknown>((index) => index);

  // --------------------------------------------------------------- outputs
  readonly lazyLoad = output<LazyLoadEvent<T>>();
  readonly sortChange = output<SortMeta<T>[]>();
  readonly columnResize = output<{ field: string; width: number }>();

  // ------------------------------------------------------------ int. state
  protected readonly page = signal(1);
  protected readonly pageSizeS = signal(this.paginationConfig.defaultPageSize);
  protected readonly sorts = signal<SortMeta<T>[]>([]);
  protected readonly widths = signal<Record<string, number>>({});
  private readonly manuallyResized = new Set<string>();
  private readonly rendererInputsCache = new Map<
    TableField<T, any>,
    WeakMap<T, Record<string, unknown>>
  >();

  @ContentChildren(TableCell) private cellTemplates!: QueryList<TableCell<T>>;
  private templateMap = new Map<string, TemplateRef<CellTemplateContext<T>>>();

  protected readonly resolvedMultiSort = computed(() => this.multiSort() ?? this.config.multiSort);
  private readonly directionService = inject(DirectionService);
  protected readonly resolvedDirection = computed(() => this.directionService.direction());
  constructor() {
    effect(() => {
      const ps = this.pageSize();
      if (ps) this.pageSizeS.set(ps);
    });

    // برای هر ستونِ تازه‌دیده‌شده یک عرض seed کن؛ ستون‌هایی که کاربر دستی
    // ریسایز کرده دیگر هیچ‌وقت دوباره نوشته نمی‌شوند.
    effect(() => {
      const cols = this.fields();
      const current = this.widths();
      let changed = false;
      const next = { ...current };
      for (const f of cols) {
        if (!(f.column in next) && !this.manuallyResized.has(f.column)) {
          next[f.column] = f.width ?? this.config.column.defaultWidth;
          changed = true;
        }
      }
      if (changed) this.widths.set(next);
    });
  }

  ngOnInit(): void {
    if (this.lazy()) {
      this.lazyLoad.emit({ first: 0, pageIndex: 1, pageSize: this.pageSizeS(), sorts: [] });
    }
  }

  ngAfterContentInit(): void {
    this.syncTemplateMap();
    this.cellTemplates.changes.subscribe(() => this.syncTemplateMap());
  }

  private syncTemplateMap(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach((cell) => {
      // نکته‌ی مهم: cell.column() باید فراخوانی شود (سیگنال است)، نه cell.column.name.
      this.templateMap.set(cell.column(), cell.templateRef);
    });
  }

  // ------------------------------------------------------------- داده‌ها
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
    if (this.lazy()) return this.sortedData();
    const start = (this.page() - 1) * this.pageSizeS();
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

  /** بدون mutation روی داده‌ی ورودی: شماره‌ی ردیف صرفاً از روی page/pageSize/rowIndex محاسبه می‌شود. */
  protected recordNumber(rowIndex: number): number {
    return (this.page() - 1) * this.pageSizeS() + rowIndex + 1;
  }

  // -------------------------------------------------------------- سورت
  protected sortDirectionFor(column: string): SortDirection | null {
    return this.sorts().find((s) => s.field === column)?.direction ?? null;
  }

  protected onHeaderClick(field: TableField<T, any>, event: MouseEvent): void {
    if (!field.sortable) return;
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
    this.page.set(1);
    this.sortChange.emit(next);
    this.emitLazyIfNeeded();
  }

  // ------------------------------------------------------------ صفحه‌بندی
  protected onPaginate(event: PageEvent): void {
    this.page.set(event.page);
    this.pageSizeS.set(event.pageSize);
    this.emitLazyIfNeeded();
  }

  private emitLazyIfNeeded(): void {
    if (!this.lazy()) return;
    const pageIndex = this.page();
    const pageSize = this.pageSizeS();
    this.lazyLoad.emit({
      pageIndex,
      pageSize,
      first: (pageIndex - 1) * pageSize,
      sorts: this.sorts(),
    });
  }

  // -------------------------------------------------------------- ریسایز
  protected columnWidth(column: string): number {
    return this.widths()[column] ?? this.config.column.defaultWidth;
  }
  protected columnMin(field: TableField<T, any>): number {
    return field.minWidth ?? this.config.column.minWidth;
  }
  protected columnMax(field: TableField<T, any>): number {
    return field.maxWidth ?? this.config.column.maxWidth;
  }
  protected isResizable(field: TableField<T, any>): boolean {
    return (field.resizable ?? this.config.resizable) !== false;
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
    // نکته: نوع دقیق field.renderer (که به کلیدهای رجیستری محدود است) در
    // defineFields() چک می‌شود؛ اینجا فقط یک lookup رانتایم ساده لازم است.
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

  /** ورودی‌های renderer را به‌ازای هر (field, row) کش می‌کند تا هر Change
   *  Detection یک آبجکت جدید ساخته نشود؛ با WeakMap، وقتی row از حافظه خارج
   *  شود (مثلاً بعد از عوض‌شدن صفحه)، entry آن هم خودکار پاک می‌شود. */
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
