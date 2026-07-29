export type SortDirection = 'asc' | 'desc';

export interface SortMeta<T> {
  field: Extract<keyof T, string>;
  direction: SortDirection;
}

export interface PageState {
  pageIndex: number;
  pageSize: number;
  /** Zero-based offset of the first row on the current page (pageIndex * pageSize). */
  first: number;
}

/** Emitted by the table whenever the server needs to (re)fetch a page in lazy mode. */
export interface LazyLoadEvent<T> extends PageState {
  sorts: SortMeta<T>[];
}
