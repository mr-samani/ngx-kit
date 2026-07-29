import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NGX_TABLE_CONFIG } from '../../tokens/table-config.token';

@Component({
  selector: 'ngx-table-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTablePaginatorComponent {
  protected readonly config = inject(NGX_TABLE_CONFIG);

  readonly total = input.required<number>();
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input<number[]>(this.config.pagination.pageSizeOptions);

  readonly pageIndexChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly locale = this.config.locale;

  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly first = computed(() => (this.total() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1));
  protected readonly last = computed(() => Math.min(this.total(), (this.pageIndex() + 1) * this.pageSize()));
  protected readonly rangeLabel = computed(() =>
    this.locale.of
      .replace('{first}', String(this.first()))
      .replace('{last}', String(this.last()))
      .replace('{total}', String(this.total()))
  );

  protected readonly canPrev = computed(() => this.pageIndex() > 0);
  protected readonly canNext = computed(() => this.pageIndex() < this.pageCount() - 1);

  protected goFirst(): void {
    if (this.canPrev()) this.pageIndexChange.emit(0);
  }
  protected goPrev(): void {
    if (this.canPrev()) this.pageIndexChange.emit(this.pageIndex() - 1);
  }
  protected goNext(): void {
    if (this.canNext()) this.pageIndexChange.emit(this.pageIndex() + 1);
  }
  protected goLast(): void {
    if (this.canNext()) this.pageIndexChange.emit(this.pageCount() - 1);
  }

  protected onPageSizeSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}
