import { InjectionToken } from '@angular/core';

export interface PaginationConfig {
  pageSizeOptions: number[];
  defaultPageSize: number;
}

export interface ColumnConfig {
  /** Global minimum width (px) enforced on every resizable column unless overridden per-column. */
  minWidth: number;
  /** Global maximum width (px) enforced on every resizable column unless overridden per-column. */
  maxWidth: number;
  /** Width (px) used for a column when neither `width` nor a manual resize has been applied. */
  defaultWidth: number;
}

export interface TableLocale {
  noData: string;
  loading: string;
  rowsPerPage: string;
  /** Template for the range label. Tokens: {first} {last} {total} */
  of: string;
  first: string;
  last: string;
  next: string;
  previous: string;
}

export interface TableGlobalConfig {
  column: ColumnConfig;
  pagination: PaginationConfig;
  locale: TableLocale;
  /** Enable multi-column sort by default (Ctrl/Shift + click) unless a table overrides it. */
  multiSort: boolean;
  resizable: boolean;
  stripedRows: boolean;
  hoverable: boolean;
  stickyHeader: boolean;
}

export type PartialTableGlobalConfig = Partial<
  Omit<TableGlobalConfig, 'column' | 'pagination' | 'locale'>
> & {
  column?: Partial<ColumnConfig>;
  pagination?: Partial<PaginationConfig>;
  locale?: Partial<TableLocale>;
};

export const DEFAULT_TABLE_CONFIG: TableGlobalConfig = {
  column: { minWidth: 60, maxWidth: 600, defaultWidth: 150 },
  pagination: { pageSizeOptions: [10, 25, 50, 100], defaultPageSize: 10 },
  locale: {
    noData: 'No records found',
    loading: 'Loading...',
    rowsPerPage: 'Rows per page',
    of: '{first}-{last} of {total}',
    first: 'First page',
    last: 'Last page',
    next: 'Next page',
    previous: 'Previous page',
  },
  multiSort: false,
  resizable: false,
  stripedRows: true,
  hoverable: true,
  stickyHeader: true,
};

/** Injected into every ngx-table instance. Populate via provideTable(). */
export const NGX_TABLE_CONFIG = new InjectionToken<TableGlobalConfig>('NGX_TABLE_CONFIG');
