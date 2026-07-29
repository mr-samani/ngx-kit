import {
  AfterContentInit,
  Component,
  ContentChildren,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  Output,
  QueryList,
  signal,
  TemplateRef,
  Type,
  viewChild,
} from '@angular/core';
import { FieldsType, SortEvent } from '../../types/FieldsType';
import { TableCellDirective } from '../../directives/table-cell.directive';
import { NGX_TABLE_CONFIG } from '../../tokens/table-config.token';
import { NGX_PAGINATION_CONFIG } from '../../tokens/pagination-config.token';
import { PageEvent } from '../../types/PageEvent';
import { CommonModule } from '@angular/common';
import { NgxPagination } from '../pagination/pagination';
import { LazyLoadEvent } from '../../types/LazyLoadEvent';

@Component({
  selector: 'ngx-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  imports: [CommonModule, NgxPagination],
  providers: [],
})
export class NgxTable<T extends object> implements OnInit, AfterContentInit {
  protected readonly config = inject(NGX_TABLE_CONFIG);
  protected readonly paginationConfig = inject(NGX_PAGINATION_CONFIG);
  readonly fields = input.required<FieldsType<T>[]>();
  readonly data = input.required<T[]>();
  readonly totalRecords = input.required<number>();

  list = signal<readonly T[]>([]);

  readonly operations = input<TemplateRef<any>>();
  readonly operationWidth = input(60);
  readonly pageSize = input(this.paginationConfig.defaultPageSize);
  readonly loading = input(false);
  readonly multiSort = input(this.config.multiSort);

  readonly lazy = input(false);
  readonly lazyLoad = output<LazyLoadEvent<T>>();

  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  tableContainer = viewChild<ElementRef<HTMLDivElement>>('tableContainer');
  @Output() sortChange = new EventEmitter<SortEvent>();
  @ContentChildren(TableCellDirective) cellTemplates!: QueryList<TableCellDirective>;
  templateMap: Map<string, TemplateRef<any>> = new Map();

  page = 1;

  constructor() {
    effect(() => {
      const data = this.data();

      if (this.lazy()) {
        this.list.set(data);
        return;
      }

      this.loadClientPage(data);
    });
  }

  ngOnInit(): void {
    if (this.lazy()) {
      this.lazyLoad.emit({
        first: 0,
        pageIndex: 1,
        pageSize: this.pageSize(),
        sorts: [],
      });
    }
  }
  ngAfterContentInit(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach((cell) => {
      // console.log(cell.columnName, cell.template);
      this.templateMap.set(cell.column.name, cell.template);
    });
    this.adjustScroll(this.tableContainer()?.nativeElement);
  }

  private loadClientPage(data: T[]): void {
    const from = (this.page - 1) * this.pageSize();
    const to = from + this.pageSize();

    this.list.set(data.slice(from, to));
  }

  onSortChange(item: FieldsType<T>) {}

  protected getTemplate(column: Extract<keyof T, string>): TemplateRef<unknown> | null {
    return this.templateMap.get(column) ?? null;
  }

  sortList() {
    // this._list = orderBy(this._list, [this.sortField], [this.sortDirection]);
  }

  onPageChange(event: PageEvent) {
    this.page = event.page;

    if (this.lazy()) {
      this.lazyLoad.emit({
        first: (event.page - 1) * event.pageSize,
        pageIndex: event.page,
        pageSize: event.pageSize,
        sorts: this.sortField
          ? [
              {
                field: this.sortField as Extract<keyof T, string>,
                direction: this.sortDirection,
              },
            ]
          : [],
      });

      return;
    }

    this.loadClientPage(this.data());
  }

  /**
   * اگر بدنه جدول اسکرول شد هدر جدول نیز منطبق شود
   */
  private adjustScroll(table?: HTMLElement) {
    if (!table) return;
    const body = table.querySelector('.tbody-mrs');
    const header = table.querySelector('.thead-mrs');
    if (!body || !header) return;
    body.addEventListener('scroll', () => {
      header.scrollLeft = body.scrollLeft;
    });
  }

  protected getRenderer(field: FieldsType<T>): Type<unknown> | null {
    const key = field.renderer ?? field.dataType;

    if (!key) {
      return null;
    }

    return this.config.renderers?.[key] ?? null;
  }

  protected getCellValue(row: T, field: FieldsType<T>): unknown {
    return row[field.column];
  }

  protected formatCellValue(row: T, field: FieldsType<T>): string {
    const value = this.getCellValue(row, field);

    if (typeof field.formatter === 'function') {
      return this.stringify(field.formatter(value, row, field as FieldsType<object>));
    }

    if (typeof field.formatter === 'string') {
      const formatter = this.config.formatters?.[field.formatter];

      if (formatter) {
        return this.stringify(formatter(value, row, field as FieldsType<object>));
      }
    }

    return this.stringify(value);
  }

  private stringify(value: unknown): string {
    return value == null ? '' : String(value);
  }

  protected getRendererInputs(row: T, field: FieldsType<T>): Record<string, unknown> {
    return {
      value: this.getCellValue(row, field),
      row,
      field,
      ...field.rendererInputs,
    };
  }
}
