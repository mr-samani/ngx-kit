import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGX_TABLE_CONFIG, NGX_TABLE_CONFIG_DEFAULT } from '../tokens/table-config.token';
import { NgxTableOptions, ResolvedTableOptions } from '../types/table-options.types';

function mergeTableConfig(
  base: ResolvedTableOptions,
  override?: NgxTableOptions,
): ResolvedTableOptions {
  if (!override) return base;
  return {
    ...base,
    ...override,
    column: { ...base.column, ...override.column },
    labels: { ...base.labels, ...override.labels },
    renderers: { ...base.renderers, ...override.renderers },
    formatters: { ...base.formatters, ...override.formatters },
  };
}

/**
 * کانفیگ سراسری <ngx-table>: جهت پیش‌فرض، حداقل/حداکثر عرض ستون، فعال بودن
 * پیش‌فرض سورت چندستونه، و از همه مهم‌تر رجیستری رندررها.
 *
 * @example
 * provideTable({
 *   renderers: defineRenderers({ avatar: AvatarCellRenderer, boolean: BooleanCellRenderer }),
 *   column: { minWidth: 80, maxWidth: 480, defaultWidth: 160 },
 * })
 */
export function provideTable(options?: NgxTableOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NGX_TABLE_CONFIG, useValue: mergeTableConfig(NGX_TABLE_CONFIG_DEFAULT, options) },
  ]);
}
