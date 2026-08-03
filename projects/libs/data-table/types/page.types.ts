import { SortMeta } from './sort.types';

export interface PageEvent {
  page: number;
  pageSize: number;
}

export interface PageState {
  pageIndex: number;
  pageSize: number;
  /** آفست صفر-پایه‌ی اولین ردیف صفحه‌ی جاری. */
  first: number;
}

/** هر بار سرور باید صفحه‌ی جدید را (در حالت lazy) واکشی کند، امیت می‌شود. */
export interface LazyLoadEvent<T> extends PageState {
  sorts: SortMeta<T>[];
}
