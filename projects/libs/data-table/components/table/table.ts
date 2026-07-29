import {
  AfterContentInit,
  Component,
  ContentChildren,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
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
import { NGX_TABLE_CONFIG, NGX_TABLE_CONFIG_DEFAULT } from '../../tokens/table-config.token';
import {
  NGX_PAGINATION_CONFIG,
  NGX_PAGINATION_CONFIG_DEFAULT,
} from '../../tokens/pagination-config.token';
import { PageEvent } from '../../types/PageEvent';
import { CommonModule } from '@angular/common';
import { NgxPagination } from '../pagination/pagination';
import { LazyLoadEvent } from '../../types/LazyLoadEvent';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'ngx-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  imports: [CommonModule, NgxPagination],
  providers: [
    { provide: NGX_TABLE_CONFIG, useValue: NGX_TABLE_CONFIG_DEFAULT },
    { provide: NGX_PAGINATION_CONFIG, useValue: NGX_PAGINATION_CONFIG_DEFAULT },
  ],
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
      const d = this.data();
      this.loadList(d);
    });
  }

  ngOnInit(): void {
    this.lazyLoad.emit({
      first: 0,
      pageIndex: 1,
      pageSize: this.pageSize(),
      sorts: [],
    });
  }
  ngAfterContentInit(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach((cell) => {
      // console.log(cell.columnName, cell.template);
      this.templateMap.set(cell.columnName, cell.template);
    });
    this.adjustScroll(this.tableContainer()?.nativeElement);
  }

  loadList(data: T[]) {
    const from = (this.page - 1) * this.pageSize();
    const to = from + this.pageSize();
    this.list.update((u) => (u = data.slice(from, to)));
  }

  onSortChange(field: string) {
    if (this.sortField == field) {
      this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
    }
    this.sortField = field;
    if (this.lazy() == false) {
      this.sortList();
    }
    this.sortChange.emit({
      field: this.sortField,
      direction: this.sortDirection,
    });
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
