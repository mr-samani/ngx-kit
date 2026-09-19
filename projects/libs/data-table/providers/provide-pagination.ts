import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGX_PAGINATION_CONFIG } from '../tokens/pagination-config.token';
import { NgxPaginationOptions } from '../types/pagination.types';
import { NGX_PAGINATION_CONFIG_DEFAULT } from '../tokens/defaults';

function mergePaginationConfig(
  base: NgxPaginationOptions,
  override?: Partial<NgxPaginationOptions>,
): NgxPaginationOptions {
  if (!override) return base;
  return {
    ...base,
    ...override,
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
