import { Component, effect, inject, input, output, signal } from '@angular/core';
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
  readonly pageSize = input(this.config.defaultPageSize);
  readonly pageSizeOptions = input(this.config.pageSizeOptions);
  readonly labels = input(this.config.labels);

  /**
   * current page
   * - start with: 1
   **/
  currentPage = signal(1);
  readonly pageChange = output<number>();
  readonly onChange = output<PageEvent>();

  paginationCount = 0;
  pages: any[] = [];
  firstItem = signal(0);
  lastItem = signal(0);

  constructor() {
    effect(() => {
      const t = this.total();
      const s = this.pageSize();
      this.setupPage();
    });
  }

  setupPage() {
    this.paginationCount = Math.ceil(this.total() / this.pageSize());

    if (this.currentPage() < 1 || this.currentPage() > this.paginationCount) {
      this.currentPage.set(1);
      this.pageChange.emit(this.currentPage());
    }

    const pages: any[] = [];
    const delta = 2; // چند صفحه قبل و بعد از page نشان داده شود

    const left = Math.max(2, this.currentPage() - delta);
    const right = Math.min(this.paginationCount - 1, this.currentPage() + delta);

    // همیشه صفحه اول
    pages.push(1);

    // ... اگر فاصله زیاد بود
    if (left > 2) {
      pages.push('...');
    }

    // صفحات میانی
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // ... اگر فاصله زیاد بود
    if (right < this.paginationCount - 1) {
      pages.push('...');
    }

    // همیشه صفحه آخر
    if (this.paginationCount > 1) {
      pages.push(this.paginationCount);
    }

    this.pages = pages;

    this.firstItem.update((u) => (u = (this.currentPage() - 1) * this.pageSize() + 1));
    this.lastItem.update(
      (u) => (u = Math.min(this.firstItem() + this.pageSize() - 1, this.total())),
    );
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.setupPage();
    this.pageChange.emit(page);
    this.onChange.emit({
      page: this.currentPage(),
      pageSize: this.pageSize(),
    });
  }

  onpageSizeChange() {
    this.setupPage();
    if (this.paginationCount < this.currentPage()) {
      this.currentPage.set(1);
    }
    this.pageChange.emit(this.currentPage());
    this.onChange.emit({
      page: this.currentPage(),
      pageSize: +this.pageSize(),
    });
  }

  next() {
    if (this.currentPage() < this.paginationCount) {
      this.currentPage.update((p) => p++);
    }
    this.onPageChange(this.currentPage());
  }

  previous() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p--);
    }
    this.onPageChange(this.currentPage());
  }

  first() {
    this.currentPage.set(1);
    this.onPageChange(this.currentPage());
  }
  last() {
    this.currentPage.set(this.paginationCount);
    this.onPageChange(this.currentPage());
  }
}
