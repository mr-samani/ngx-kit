import { InjectionToken } from '@angular/core';
import { ResolvedTableOptions } from '../types/table-options.types';
import { NGX_TABLE_CONFIG_DEFAULT } from './defaults';
import { TableLocalization } from '../localization/table.localization';

export const NGX_TABLE_CONFIG = new InjectionToken<ResolvedTableOptions>('NGX_TABLE_CONFIG', {
  factory: () => NGX_TABLE_CONFIG_DEFAULT,
});

export const NGX_TABLE_I18N = new InjectionToken<TableLocalization>('NGX_TABLE_I18N', {
  factory: () => new TableLocalization(),
});
