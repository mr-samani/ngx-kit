import { SortMeta } from './sort.types';
import { ColumnFilterState } from './filter.type';

export interface PageEvent {
  page: number;
  pageSize: number;
}

export interface PageState {
  pageIndex: number;
  pageSize: number;
  first: number;
}

export interface LazyLoadEvent<T> extends PageState {
  sorts?: SortMeta<T>[];
  sorting?: string;
  filters?: ColumnFilterState[];
}