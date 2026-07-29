import { Observable, of } from 'rxjs';
import { Tenant } from './tenants.model';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface GetTenantsInput {
  skipCount: number;
  maxResultCount: number;
  sorting?: string;
}

/**
 * Replace this with your real ABP/HttpClient service. Shape shown here
 * matches the `(lazyLoad)` contract expected in tenants-table.component.ts.
 */
export class TenantsService {
  getTenants(input: GetTenantsInput): Observable<PagedResult<Tenant>> {
    // return this.http.get<PagedResult<Tenant>>('/api/services/app/Tenant/GetAll', { params: ... });
    return of({
      items: <Tenant[]>[
        {
          creationTime: new Date().toISOString(),
          id: 1,
          isActive: true,
          name: 'Mr-s',
          tenancyName: 'My Tenant Name is Absxcdr Rer',
          editionDisplayName: 'Standard Multi user',
        },
      ],
      totalCount: 0,
    });
  }
}
