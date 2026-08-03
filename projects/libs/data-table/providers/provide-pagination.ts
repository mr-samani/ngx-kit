import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  NGX_PAGINATION_CONFIG,
  NGX_PAGINATION_CONFIG_DEFAULT,
} from '../tokens/pagination-config.token';
import { NgxPaginationOptions } from '../types/pagination.types';

function mergePaginationConfig(
  base: NgxPaginationOptions,
  override?: Partial<NgxPaginationOptions>,
): NgxPaginationOptions {
  if (!override) return base;
  return {
    ...base,
    ...override,
    labels: { ...base.labels, ...override.labels },
  };
}

export function providePagination(options?: Partial<NgxPaginationOptions>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_PAGINATION_CONFIG,
      useValue: mergePaginationConfig(NGX_PAGINATION_CONFIG_DEFAULT, options),
    },
  ]);
}
