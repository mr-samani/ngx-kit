export interface NgxVirtualForOfContext<T> {
  $implicit: T;
  ngxVirtualForOf: readonly T[];
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}
