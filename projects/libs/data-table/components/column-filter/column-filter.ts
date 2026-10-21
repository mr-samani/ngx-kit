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
  private readonly elementRef = inject(ElementRef);

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
    if (nextState) this.syncStateFromInput();
    this.isOpen.set(nextState);
  }

  private syncStateFromInput(): void {
    const cur = this.currentFilter();
    const type = this.filterType();

    if (cur) {
      this.selectedOperator.set(cur.operator);
      if (type === 'enum' && Array.isArray(cur.value)) {
        this.selectedEnumValues.set(new Set(cur.value));
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
    let operator = this.selectedOperator();

    if (type === 'enum') {
      operator = DynamicDataFilterOperator.In;
      value = Array.from(this.selectedEnumValues());
    }

    this.applyFilter.emit({
      field: this.field(),
      operator,
      value,
      valueTo: this.selectedOperator() === DynamicDataFilterOperator.Between ? this.filterValueTo() : undefined,
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
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) this.isOpen.set(false);
  }
}