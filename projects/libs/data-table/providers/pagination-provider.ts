import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  NGX_PAGINATION_CONFIG,
  NGX_PAGINATION_CONFIG_DEFAULT,
} from '../tokens/pagination-config.token';
import { mergeConfig } from 'ngx-kit/shared';
import { NgxPaginationOptions } from '../types/PaginationOptions';

export function providePagination(options?: NgxPaginationOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_PAGINATION_CONFIG,
      useValue: mergeConfig(NGX_PAGINATION_CONFIG_DEFAULT, options),
    },
  ]);
}
