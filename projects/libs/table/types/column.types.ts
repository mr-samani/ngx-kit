import { TemplateRef } from '@angular/core';

export type ColumnAlign = 'start' | 'center' | 'end';

/** Context passed into a custom cell template. Fully typed against the row model T. */
export interface CellContext<T> {
  $implicit: T;
  row: T;
  rowIndex: number;
  column: TableColumn<T>;
}

/** Context passed into a custom header template. */
export interface HeaderContext<T> {
  $implicit: TableColumn<T>;
}

/**
 * Column definition bound to the row model T.
 * `field` is constrained to `keyof T`, so if the model changes and a field
 * is renamed/removed, every `defineColumns<T>()` call referencing the old
 * field name will fail to compile instead of silently rendering blank.
 */
export interface TableColumn<T, K extends Extract<keyof T, string> = Extract<keyof T, string>> {
  /** Property name on the row model. Must be a real key of T. */
  field: K;
  /** Header text (already localized by the caller). */
  header: string;
  /** Enables click-to-sort on this column. */
  sortable?: boolean;
  /** Enables the drag handle to resize this column. Defaults to true. */
  resizable?: boolean;
  /** Initial width in px. Falls back to the global config default. */
  width?: number;
  /** Per-column override of the global minimum width. */
  minWidth?: number;
  /** Per-column override of the global maximum width. */
  maxWidth?: number;
  /** Text/content alignment. Defaults to 'start'. */
  align?: ColumnAlign;
  /** Set to false to hide the column without removing it from the array. */
  visible?: boolean;
  /** Custom string formatter for the default (non-templated) cell renderer. */
  format?: (row: T) => string;
  /** Custom cell template. Context is typed via CellContext<T>. */
  cellTemplate?: TemplateRef<CellContext<T>>;
  /** Custom header template. */
  headerTemplate?: TemplateRef<HeaderContext<T>>;
}

/**
 * Identity helper used to declare a column array with full inference and
 * compile-time checking against the row model T.
 *
 * @example
 * interface Tenant { id: number; tenancyName: string; isActive: boolean }
 *
 * const columns = defineColumns<Tenant>([
 *   { field: 'tenancyName', header: 'Tenancy Name', sortable: true }, // OK
 *   { field: 'tenancyCode', header: '...' },                          // ❌ compile error
 * ]);
 */
export function defineColumns<T>(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns;
}
