import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export class UserDto {
  fullName = '';
  userName = '';
  email = '';
  roles: string[] = [];
  isActive?: boolean;

  avatarUrl?: string;
  status?: 'active' | 'inactive' | 'blocked' | 'pending';
  createdAt?: string;
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

@Injectable()
export class DataService {
  private readonly allUsers = this.generateUsers(100);

  getUsers(input: GetInputDto): Observable<PagedResult<UserDto>> {
    let items = [...this.allUsers];

    if (input.sorting) {
      const [field, direction] = input.sorting.split(' ');
      items.sort((a: any, b: any) => {
        const av = a[field];
        const bv = b[field];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return direction === 'desc' ? 1 : -1;
        if (av > bv) return direction === 'desc' ? -1 : 1;
        return 0;
      });
    }

    const page = items.slice(input.skipCount, input.skipCount + input.maxResultCount);
    return of({ items: page, totalCount: items.length }).pipe(delay(400));
  }

  private generateUsers(count: number): UserDto[] {
    const firstNames = [
      'Michael',
      'Alexander',
      'Daniel',
      'James',
      'Andrew',
      'Robert',
      'William',
      'Thomas',
      'Ryan',
      'Ethan',
    ];
    const lastNames = [
      'Sanders',
      'Carter',
      'Bennett',
      'Foster',
      'Mitchell',
      'Turner',
      'Parker',
      'Reed',
      'Cooper',
      'Morgan',
    ];
    const roleSets = [
      ['Admin'],
      ['User'],
      ['Manager'],
      ['Admin', 'User'],
      ['Editor'],
      ['Support'],
      ['Developer'],
      ['Developer', 'Admin'],
      ['Guest'],
      [],
    ];
    const statuses: UserDto['status'][] = ['active', 'inactive', 'blocked', 'pending'];

    return Array.from({ length: count }, (_, i) => {
      const first = firstNames[i % firstNames.length];
      const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      const user = new UserDto();

      user.fullName = `${first} ${last}`;
      user.userName = `${first.toLowerCase()}${i + 1}`;
      user.email = i % 11 === 0 ? '' : `user${i + 1}@example.com`;
      user.roles = roleSets[i % roleSets.length];
      user.isActive = i % 7 === 0 ? undefined : i % 2 === 0;
      user.status = statuses[i % statuses.length];
      user.createdAt = new Date(2024, i % 12, (i % 28) + 1, i % 24, i % 60).toISOString();
      user.avatarUrl = i % 3 === 0 ? `https://i.pravatar.cc/150?img=${(i % 70) + 1}` : undefined;

      return user;
    });
  }
}
