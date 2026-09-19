import { InjectionToken } from '@angular/core';
import { NgxPaginationOptions } from '../types/pagination.types';
import { NGX_PAGINATION_CONFIG_DEFAULT } from './defaults';
import { PaginationLocalization } from '../localization/pagination.localization';

export const NGX_PAGINATION_CONFIG = new InjectionToken<NgxPaginationOptions>(
  'NGX_PAGINATION_CONFIG',
  {
    factory: () => NGX_PAGINATION_CONFIG_DEFAULT,
  },
);

export const NGX_PAGINATION_I18N = new InjectionToken<PaginationLocalization>(
  'NGX_PAGINATION_I18N',
  {
    factory: () => new PaginationLocalization(),
  },
);
