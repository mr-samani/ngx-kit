import { AfterViewInit, Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NGX_PAGINATION_CONFIG,
  NGX_PAGINATION_CONFIG_DEFAULT,
} from '../../tokens/pagination-config.token';
import { PageEvent } from '../../types/PageEvent';

@Component({
  selector: 'ngx-pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  imports: [FormsModule],
  providers: [
    {
      provide: NGX_PAGINATION_CONFIG,
      useValue: NGX_PAGINATION_CONFIG_DEFAULT,
    },
  ],
})
export class NgxPagination implements AfterViewInit {
  protected readonly config = inject(NGX_PAGINATION_CONFIG);
  total = input.required<number>();
  pageSize = input(this.config.defaultPageSize);
  pageSizeOptions = input(this.config.pageSizeOptions);
  labels = input(this.config.labels);
  /**
   * current page
   * - start with: 1
   **/
  currentPage = signal(1);
  pageChange = output<number>();
  onChange = output<PageEvent>();

  paginationCount = 0;
  pages: any[] = [];
  firstItem = 0;
  lastItem = 0;

  constructor() {}

  ngAfterViewInit(): void {
    this.setupPage();
  }

  setupPage() {
    debugger;
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

    this.firstItem = (this.currentPage() - 1) * this.pageSize() + 1;
    this.lastItem = Math.min(this.firstItem + this.pageSize() - 1, this.total());
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
