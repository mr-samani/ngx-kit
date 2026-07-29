import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NGX_PAGINATION_CONFIG } from '../../tokens/pagination-config.token';
import { PageEvent } from '../../types/PageEvent';

@Component({
  selector: 'ngx-pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  imports: [FormsModule],
})
export class NgxPagination {
  protected readonly config = inject(NGX_PAGINATION_CONFIG);
  readonly total = input.required<number>();

  readonly page = model(1);

  readonly pageSize = model(this.config.defaultPageSize);

  readonly pageSizeOptions = input(this.config.pageSizeOptions);

  readonly labels = input(this.config.labels);

  readonly siblingCount = input(1);

  readonly boundaryCount = input(1);

  readonly paginate = output<PageEvent>();

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  });
  readonly firstItem = computed(() => {
    if (this.total() === 0) return 0;

    return (this.page() - 1) * this.pageSize() + 1;
  });

  readonly lastItem = computed(() => {
    return Math.min(
      this.firstItem() + this.pageSize() - 1,

      this.total(),
    );
  });
  readonly pages = computed(() =>
    this.buildPages(this.page(), this.totalPages(), this.siblingCount(), this.boundaryCount()),
  );

  constructor() {
    effect(() => {
      const page = this.page();

      const pageSize = +this.pageSize();

      // this.pageChange.emit(page);
      debugger;
      this.paginate.emit({
        page,
        pageSize,
      });
    });

    effect(() => {
      const max = this.totalPages();
      if (this.page() > max) this.page.set(max);
    });
  }

  private buildPages(
    current: number,
    total: number,
    sibling = 1,
    boundary = 1,
  ): (number | string)[] {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const totalNumbers = sibling * 2 + boundary * 2 + 3;

    if (total <= totalNumbers) return range(1, total);

    const leftSibling = Math.max(current - sibling, boundary + 2);

    const rightSibling = Math.min(current + sibling, total - boundary - 1);

    const showLeftDots = leftSibling > boundary + 2;

    const showRightDots = rightSibling < total - boundary - 1;

    const pages: (number | string)[] = [];

    pages.push(...range(1, boundary));

    if (showLeftDots) pages.push('...');
    else pages.push(...range(boundary + 1, leftSibling - 1));

    pages.push(...range(leftSibling, rightSibling));

    if (showRightDots) pages.push('...');
    else pages.push(...range(rightSibling + 1, total - boundary));

    pages.push(...range(total - boundary + 1, total));

    return pages;
  }

  next() {
    this.page.update((p) => Math.min(p + 1, this.totalPages()));
  }

  previous() {
    this.page.update((p) => Math.max(1, p - 1));
  }

  first() {
    this.page.set(1);
  }
  last() {
    this.page.set(this.totalPages());
  }
  goto(page: number) {
    if (typeof page !== 'number') return;

    this.page.set(page);
  }
}
