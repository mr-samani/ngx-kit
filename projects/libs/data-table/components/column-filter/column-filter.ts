import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ColumnFilterConfig,
  ColumnFilterState,
  DynamicDataFilterOperator,
  EnumFilterOption,
  FilterDataType,
} from '../../types/filter.type';
import { NGX_TABLE_I18N } from '../../tokens/table-config.token';

@Component({
  selector: 'ngx-column-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './column-filter.html',
  styleUrl: './column-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxColumnFilter {
  protected readonly labels = inject(NGX_TABLE_I18N);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly tableEl = input.required<ElementRef<HTMLElement>>();
  readonly field = input.required<string>();
  readonly config = input<ColumnFilterConfig>();
  readonly currentFilter = input<ColumnFilterState | null>(null);
  readonly distinctValues = input<unknown[]>([]);

  readonly applyFilter = output<ColumnFilterState>();
  readonly clearFilter = output<string>();

  protected readonly isOpen = signal(false);
  protected readonly filterType = computed<FilterDataType>(() => this.config()?.type ?? 'text');

  protected readonly selectedOperator = signal<DynamicDataFilterOperator>(
    DynamicDataFilterOperator.Contains,
  );
  protected readonly filterValue = signal<any>('');
  protected readonly filterValueTo = signal<any>('');
  protected readonly selectedEnumValues = signal<Set<any>>(new Set());
  protected readonly enumSearchQuery = signal<string>('');

  protected readonly operators = computed(() => {
    const type = this.filterType();
    const l = this.labels;

    if (type === 'number') {
      return [
        { label: l.opEqual, value: DynamicDataFilterOperator.Equal },
        { label: l.opNotEqual, value: DynamicDataFilterOperator.NotEqual },
        { label: l.opGreaterThan, value: DynamicDataFilterOperator.GreaterThan },
        { label: l.opGreaterThanOrEqual, value: DynamicDataFilterOperator.GreaterThanOrEqual },
        { label: l.opLessThan, value: DynamicDataFilterOperator.LessThan },
        { label: l.opLessThanOrEqual, value: DynamicDataFilterOperator.LessThanOrEqual },
        { label: l.opBetween, value: DynamicDataFilterOperator.Between },
        { label: l.opIsNull, value: DynamicDataFilterOperator.IsNull },
        { label: l.opIsNotNull, value: DynamicDataFilterOperator.IsNotNull },
      ];
    }

    if (type === 'date') {
      return [
        { label: l.opEqual, value: DynamicDataFilterOperator.Equal },
        { label: l.opGreaterThan, value: DynamicDataFilterOperator.GreaterThan },
        { label: l.opLessThan, value: DynamicDataFilterOperator.LessThan },
        { label: l.opBetween, value: DynamicDataFilterOperator.Between },
        { label: l.opIsNull, value: DynamicDataFilterOperator.IsNull },
        { label: l.opIsNotNull, value: DynamicDataFilterOperator.IsNotNull },
      ];
    }

    if (type === 'boolean') {
      return [
        { label: l.opEqual, value: DynamicDataFilterOperator.Equal },
        { label: l.opIsNull, value: DynamicDataFilterOperator.IsNull },
        { label: l.opIsNotNull, value: DynamicDataFilterOperator.IsNotNull },
      ];
    }

    // Default: text
    return [
      { label: l.opContains, value: DynamicDataFilterOperator.Contains },
      { label: l.opStartsWith, value: DynamicDataFilterOperator.StartsWith },
      { label: l.opEndsWith, value: DynamicDataFilterOperator.EndsWith },
      { label: l.opEqual, value: DynamicDataFilterOperator.Equal },
      { label: l.opNotEqual, value: DynamicDataFilterOperator.NotEqual },
      { label: l.opIsEmpty, value: DynamicDataFilterOperator.IsEmpty },
      { label: l.opIsNotEmpty, value: DynamicDataFilterOperator.IsNotEmpty },
      { label: l.opIsNull, value: DynamicDataFilterOperator.IsNull },
      { label: l.opIsNotNull, value: DynamicDataFilterOperator.IsNotNull },
    ];
  });

  protected readonly enumOptions = computed<EnumFilterOption[]>(() => {
    const cfg = this.config();
    if (cfg?.options && cfg.options.length > 0) return cfg.options;

    const values = this.distinctValues();
    return values
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => ({ label: String(v), value: v }));
  });

  protected readonly filteredEnumOptions = computed(() => {
    const q = this.enumSearchQuery().trim().toLowerCase();
    const opts = this.enumOptions();
    if (!q) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(q));
  });

  protected readonly isNoValueOperator = computed(() => {
    const op = this.selectedOperator();
    return [
      DynamicDataFilterOperator.IsNull,
      DynamicDataFilterOperator.IsNotNull,
      DynamicDataFilterOperator.IsEmpty,
      DynamicDataFilterOperator.IsNotEmpty,
    ].includes(op);
  });

  protected toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    const nextState = !this.isOpen();
    if (nextState) {
      this.syncStateFromInput();
      this.isOpen.set(true);
      this.updatePosition();
    } else {
      this.isOpen.set(false);
    }
  }

  updatePosition(): void {
    if (!this.isOpen()) return;

    setTimeout(() => {
      const popover: HTMLDivElement | null =
        this.elementRef.nativeElement.querySelector('.filter-popover');
      if (!popover) return;

      // پیدا کردن کانتینر اسکرول جدول
      const containerEl =
        this.tableEl()?.nativeElement ??
        this.elementRef.nativeElement.closest('.ngx-table-scroll') ??
        this.elementRef.nativeElement.closest('.ngx-table-wrapper');

      if (!containerEl) {
        popover.style.visibility = 'visible';
        return;
      }

      // ۱. ریست کردن ترنسفورم قبلی تا موقعیت واقعی بدون تغییر سنجیده شود
      popover.style.transform = 'none';

      const rect = popover.getBoundingClientRect();
      const container = containerEl.getBoundingClientRect();
      const margin = 6; // فاصله ایمن از لبه جدول

      let x = 0;
      const threshold = 10;
      // اگر از لبه سمت راست کانتینر بیرون زده باشد (حالت ستون‌های آخر):
      if (rect.right > container.right - margin) {
        // شیفت به سمت چپ (مقدار منفی)
        x = container.right - margin - rect.right - threshold;
      }
      // اگر از لبه سمت چپ بیرون زده باشد:
      else if (rect.left < container.left + margin) {
        // شیفت به سمت راست (مقدار مثبت)
        x = container.left + margin - rect.left + threshold;
      }

      // اطمینان از اینکه شیفت به چپ، باعث خروج از سمت چپ کانتینر نشود
      if (rect.left + x < container.left + margin) {
        x = container.left + margin - rect.left;
      }

      // ۲. اعمال جابجایی
      if (x !== 0) {
        popover.style.transform = `translateX(${Math.round(x)}px)`;
      } else {
        popover.style.transform = 'none';
      }

      // ۳. نمایش پاپ‌آپ پس از تنظیم موقعیت بدون پرش تصویر (Flicker)
      popover.style.visibility = 'visible';
    }, 0);
  }

  private syncStateFromInput(): void {
    const cur = this.currentFilter();
    const type = this.filterType();

    if (cur) {
      this.selectedOperator.set(cur.operator);
      if (type === 'enum' && Array.isArray(cur.values)) {
        this.selectedEnumValues.set(new Set(cur.values));
      } else {
        this.filterValue.set(cur.value ?? '');
        this.filterValueTo.set(cur.valueTo ?? '');
      }
    } else {
      const defaultOp =
        this.config()?.defaultOperator ??
        (type === 'number' || type === 'date' || type === 'boolean'
          ? DynamicDataFilterOperator.Equal
          : DynamicDataFilterOperator.Contains);
      this.selectedOperator.set(defaultOp);
      this.filterValue.set('');
      this.filterValueTo.set('');
      if (type === 'enum') {
        this.selectedEnumValues.set(new Set(this.enumOptions().map((o) => o.value)));
      }
    }
  }

  protected onApply(): void {
    const type = this.filterType();
    let value = this.filterValue();
    let values = [];
    let operator = this.selectedOperator();

    if (type === 'enum') {
      operator = DynamicDataFilterOperator.In;
      values = Array.from(this.selectedEnumValues());
    }

    this.applyFilter.emit({
      field: this.field(),
      operator,
      value,
      valueTo:
        this.selectedOperator() === DynamicDataFilterOperator.Between
          ? this.filterValueTo()
          : undefined,
      values,
    });
    this.isOpen.set(false);
  }

  protected onClear(): void {
    this.filterValue.set('');
    this.filterValueTo.set('');
    this.selectedEnumValues.set(new Set());
    this.clearFilter.emit(this.field());
    this.isOpen.set(false);
  }

  protected toggleEnumSelection(val: any): void {
    const current = new Set(this.selectedEnumValues());
    if (current.has(val)) current.delete(val);
    else current.add(val);
    this.selectedEnumValues.set(current);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedEnumValues.set(new Set(this.enumOptions().map((o) => o.value)));
    } else {
      this.selectedEnumValues.set(new Set());
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) this.isOpen.set(false);
  }
}
