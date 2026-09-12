import { signal } from '@angular/core';
import { NgxInfiniteScrollEvent } from 'ngx-kit/infinite-scroll';

export class ExampleComponent {
  readonly items = signal<Item[]>([]);
  readonly loading = signal(false);
  readonly endOfList = signal(false);

  loadMore(event?: NgxInfiniteScrollEvent): void {
    const direction = event?.direction ?? 'down';
    this.loading.set(true);

    // Replace this section with your API/data source.
    Promise.resolve(this.fetchPage(direction)).then(result => {
      if (direction === 'up') {
        this.items.update(current => [...result.items, ...current]);
      } else {
        this.items.update(current => [...current, ...result.items]);
      }

      this.endOfList.set(result.endOfList);
      this.loading.set(false);
    });
  }

  private fetchPage(_direction: 'up' | 'down'): PageResult {
    return { items: [], endOfList: true };
  }
}

interface Item {
  id: number;
  title: string;
}

interface PageResult {
  items: Item[];
  endOfList: boolean;
}
