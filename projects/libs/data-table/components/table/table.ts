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
      this.templateMap.set(cell.columnName, cell.template);
    });
    this.adjustScroll(this.tableContainer()?.nativeElement);
  }

  private loadClientPage(data: T[]): void {
    const from = (this.page - 1) * this.pageSize();
    const to = from + this.pageSize();

    this.list.set(data.slice(from, to));
  }

  onSortChange(event: PageEvent) {
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

  // getTemplate(column: string): TemplateRef<any> | null {
  //   return this.templateMap.get(column) ?? null;
  // }

  sortList() {
    // this._list = orderBy(this._list, [this.sortField], [this.sortDirection]);
  }

  onPageChange(ev: PageEvent) {
    const f = (ev.page - 1) * ev.pageSize;
    const t = f + ev.pageSize;
    this.list.update((u) => this.data().slice(f, t));
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

  protected cellValue(row: any, col: FieldsType<T>): string {
    const value = row[col.column];
    return value == null ? '' : String(value);
  }
}
