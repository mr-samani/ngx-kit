import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  DEFAULT_TABLE_CONFIG,
  NGX_TABLE_CONFIG,
  PartialTableGlobalConfig,
  TableGlobalConfig,
} from '../tokens/table-config.token';

function mergeConfig(base: TableGlobalConfig, override?: PartialTableGlobalConfig): TableGlobalConfig {
  if (!override) return base;
  return {
    ...base,
    ...override,
    column: { ...base.column, ...override.column },
    pagination: { ...base.pagination, ...override.pagination },
    locale: { ...base.locale, ...override.locale },
  };
}

/**
 * Registers application-wide defaults for every <ngx-table>: direction,
 * min/max column width, page size options, locale strings, etc.
 * Individual [input] bindings on a table always win over these defaults.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTable({
 *       direction: 'rtl',
 *       column: { minWidth: 80, maxWidth: 480, defaultWidth: 160 },
 *       pagination: { pageSizeOptions: [10, 20, 50], defaultPageSize: 20 },
 *       locale: { noData: 'داده‌ای یافت نشد', rowsPerPage: 'ردیف در صفحه' },
 *     }),
 *   ],
 * };
 */
export function provideTable(options?: PartialTableGlobalConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: NGX_TABLE_CONFIG, useValue: mergeConfig(DEFAULT_TABLE_CONFIG, options) }]);
}
