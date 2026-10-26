import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import type { Params } from '../types/types';
import { shallowEqual } from '../utils/utils';

/**
 * `{{ 'orders.title' | tr }}`  /  `{{ 'hello' | tr: { name } }}`
 *
 * Impure on purpose (it must follow signals), but memoised: when key, params and the
 * service revision are unchanged it returns the cached string in O(1) with no lookup.
 */
@Pipe({ name: 'tr', pure: false })
export class TrPipe implements PipeTransform {
  private readonly svc = inject(I18nService);
  private k?: string;
  private p?: Params;
  private rev = -1;
  private out = '';

  transform(key: string | null | undefined, params?: Params): string {
    if (!key) return '';
    const rev = this.svc.revision(); // tracked: marks the view dirty on lang / dictionary change
    if (rev === this.rev && key === this.k && shallowEqual(params, this.p)) return this.out;
    this.k = key;
    this.p = params;
    this.rev = rev;
    return (this.out = this.svc.t(key, params));
  }
}
