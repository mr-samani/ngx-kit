import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NGX_PAGINATION_CONFIG } from '../../tokens/pagination-config.token';
import { PageEvent } from '../../types/page.types';

@Component({
  selector: 'ngx-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );

  protected readonly firstItem = computed(() =>
    this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1,
  );

  protected readonly lastItem = computed(() =>
    Math.min(this.firstItem() + this.pageSize() - 1, this.total()),
  );

  protected readonly pages = computed(() =>
    this.buildPages(this.page(), this.totalPages(), this.siblingCount(), this.boundaryCount()),
  );

  constructor() {
    // هر تغییری در page/pageSize را برای مصرف‌کننده امیت کن.
    effect(() => {
      this.paginate.emit({ page: this.page(), pageSize: this.pageSize() });
    });

    // اگر بعد از کوچک‌شدن total، صفحه‌ی جاری خارج از بازه افتاد، اصلاحش کن.
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

  protected next(): void {
    this.page.update((p) => Math.min(p + 1, this.totalPages()));
  }
  protected previous(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }
  protected first(): void {
    this.page.set(1);
  }
  protected last(): void {
    this.page.set(this.totalPages());
  }
  protected goto(page: number): void {
    if (typeof page !== 'number' || Number.isNaN(page)) return;
    this.page.set(page);
  }
  protected onPageSizeChange(value: number): void {
    this.pageSize.set(Number(value));
    this.page.set(1);
  }
}
