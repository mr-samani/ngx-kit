import { InjectionToken } from '@angular/core';
import { TableGlobalConfig } from '../types/TableGlobalConfig';

/** Injected into every ngx-table instance. Populate via provideTable(). */
export const NGX_TABLE_CONFIG = new InjectionToken<TableGlobalConfig>('NGX_TABLE_CONFIG');

export const NGX_TABLE_CONFIG_DEFAULT: TableGlobalConfig = {
  hoverable: true,
  multiSort: true,
  resizable: false,
  stickyHeader: true,
  stripedRows: true,
};
