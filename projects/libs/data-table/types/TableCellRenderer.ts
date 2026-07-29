import { InputSignal, Type } from '@angular/core';
import { FieldsType } from './FieldsType';

/**
 * used in render implements
 */
export interface TableCellRendererComponent<TValue = unknown, TRow extends object = object> {
  value: TValue | InputSignal<TValue>;
  row: TRow | InputSignal<TRow>;
  field: FieldsType<TRow> | InputSignal<FieldsType<TRow>>;
}

/**
 * used in registry
 */
export type TableCellRendererType<TValue = unknown, TRow extends object = object> = Type<
  TableCellRendererComponent<TValue, TRow>
>;
