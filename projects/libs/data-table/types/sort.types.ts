export type SortDirection = 'asc' | 'desc';

export interface SortMeta<T> {
  field: Extract<keyof T, string>;
  direction: SortDirection;
}
