import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGX_TABLE_CONFIG, NGX_TABLE_CONFIG_DEFAULT } from '../tokens/table-config.token';
import { TableGlobalConfig } from '../types/TableGlobalConfig';
import { mergeConfig } from 'ngx-kit/shared';

export function provideTable(options?: TableGlobalConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_TABLE_CONFIG,
      useValue: mergeConfig(NGX_TABLE_CONFIG_DEFAULT, options),
    },
  ]);
}
