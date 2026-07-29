import { InjectionToken } from '@angular/core';
import { TableGlobalConfig } from '../types/TableGlobalConfig';

/** Injected into every ngx-table instance. Populate via provideTable(). */
export const NGX_TABLE_CONFIG = new InjectionToken<TableGlobalConfig>('NGX_TABLE_CONFIG', {
  factory: () => NGX_TABLE_CONFIG_DEFAULT,
});

export const NGX_TABLE_CONFIG_DEFAULT: TableGlobalConfig = {
  hoverable: true,
  multiSort: true,
  resizable: false,
  stickyHeader: true,
  stripedRows: true,
  labels: {
    noData: 'There is no data to display!',
    loading: 'Loading...',
    operation: 'Operation',
  },
};
