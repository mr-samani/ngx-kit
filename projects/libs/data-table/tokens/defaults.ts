import type { NgxPaginationOptions } from '../types/pagination.types';
import type { ResolvedTableOptions } from '../types/table-options.types';

export const NGX_PAGINATION_CONFIG_DEFAULT: NgxPaginationOptions = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 30, 50, 100],
};
export const NGX_TABLE_CONFIG_DEFAULT: ResolvedTableOptions = {
  showRecordNumber: false,
  hoverable: true,
  multiSort: true,
  resizable: true,
  stickyHeader: true,
  stripedRows: true,
  column: { minWidth: 60, maxWidth: 600, defaultWidth: 150 },

  renderers: {},
  formatters: {},
  lazy: false,
};
