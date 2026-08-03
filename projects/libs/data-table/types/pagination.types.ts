export interface PaginationLabel {
  first: string;
  last: string;
  next: string;
  previous: string;
  showing: string;
  to: string;
  of: string;
  results: string;
  pageSize: string;
}

export interface NgxPaginationOptions {
  labels: PaginationLabel;
  pageSizeOptions: number[];
  defaultPageSize: number;
}
