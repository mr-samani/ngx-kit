import { Type } from '@angular/core';
import { FieldsType } from './FieldsType';

export type TableRendererRegistry = Readonly<Record<string, Type<unknown>>>;

export type TableCellFormatter = (
  value: unknown,
  row: object,
  field: FieldsType<object>,
) => unknown;

export interface NgxTableOptions {
  showRecordNumber?: boolean;
  labels: TableLable;
  /** Enable multi-column sort by default (Ctrl/Shift + click) unless a table overrides it. */
  multiSort?: boolean;
  resizable?: boolean;
  stripedRows?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;

  renderers?: TableRendererRegistry;

  formatters?: Readonly<Record<string, TableCellFormatter>>;
}

export interface TableLable {
  operation?: string;
  noData?: string;
  loading?: string;
}
