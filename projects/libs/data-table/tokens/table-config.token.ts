import { InjectionToken } from '@angular/core';
import { ResolvedTableOptions } from '../types/table-options.types';

export const NGX_TABLE_CONFIG_DEFAULT: ResolvedTableOptions = {
  showRecordNumber: false,
  hoverable: true,
  multiSort: true,
  resizable: true,
  stickyHeader: true,
  stripedRows: true,
  column: { minWidth: 60, maxWidth: 600, defaultWidth: 150 },
  labels: {
    noData: 'There is no data to display!',
    loading: 'Loading...',
    operation: 'Operation',
  },
  renderers: {},
  formatters: {},
  lazy: false,
};

/** به هر نمونه‌ی ngx-table تزریق می‌شود. با provideTable() مقداردهی کنید. */
export const NGX_TABLE_CONFIG = new InjectionToken<ResolvedTableOptions>('ngx-table-config', {
  factory: () => NGX_TABLE_CONFIG_DEFAULT,
});
