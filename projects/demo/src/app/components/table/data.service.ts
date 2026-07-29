import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

export class UserDto {
  fullName: string = '';
  userName: string = '';
  email: string = '';
  roles: string[] = [];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface GetInputDto {
  skipCount: number;
  maxResultCount: number;
  sorting?: string;
}

/**
 * Replace this with your real ABP/HttpClient service. Shape shown here
 * matches the `(lazyLoad)` contract expected in users-table.component.ts.
 */
@Injectable()
export class DataService {
  getUsers(input: GetInputDto): Observable<PagedResult<UserDto>> {
    // return this.http.get<PagedResult<UserDto>>('/api/services/app/Users/GetAll', { params: ... });\
    const items: UserDto[] = [
      {
        userName: 'mr-samani',
        fullName: 'mohammadreza samani',
        email: 'mohammadreza@samani.com',
        roles: ['admin', 'user'],
      },
    ];

    return of({
      items,
      totalCount: items.length,
    });
  }
}
