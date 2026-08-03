import { InjectionToken } from '@angular/core';
import { NgxPaginationOptions } from '../types/pagination.types';

export const NGX_PAGINATION_CONFIG_DEFAULT: NgxPaginationOptions = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 30, 50, 100],
  labels: {
    first: 'First',
    last: 'Last',
    next: 'Next',
    previous: 'Previous',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    pageSize: 'Page Size',
  },
};

export const NGX_PAGINATION_CONFIG = new InjectionToken<NgxPaginationOptions>(
  'ngx-pagination-config',
  {
    factory: () => NGX_PAGINATION_CONFIG_DEFAULT,
  },
);
