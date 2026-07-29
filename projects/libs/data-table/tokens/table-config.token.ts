import { InjectionToken, Type } from '@angular/core';
import { NgxTableOptions } from '../types/TableOptions';

/** Injected into every ngx-table instance. Populate via provideTable(). */
export const NGX_TABLE_CONFIG = new InjectionToken<NgxTableOptions>('NGX_TABLE_CONFIG', {
  factory: () => NGX_TABLE_CONFIG_DEFAULT,
});

export const NGX_TABLE_CONFIG_DEFAULT: NgxTableOptions = {
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
  renderers: {},
  formatters: {},
};
