import { Injectable } from '@angular/core';
import { ColumnFilterState, DynamicDataFilterOperator } from '../types/filter.type';

@Injectable({ providedIn: 'root' })
export class ColumnFilterService {
  applyFilters<T>(data: T[], filters: Record<string, ColumnFilterState>): T[] {
    const activeFilters = Object.values(filters).filter(
      (f) => f && f.value !== undefined && f.value !== null && f.value !== '',
    );
    if (activeFilters.length === 0) return data;

    return data.filter((item) => {
      return activeFilters.every((filter) => this.evaluateFilter(item, filter));
    });
  }

  private evaluateFilter(item: any, filter: ColumnFilterState): boolean {
    const rawVal = item[filter.field];
    const op = filter.operator;
    const target = filter.value;
    const targetTo = filter.valueTo;

    if (op === DynamicDataFilterOperator.IsNull) return rawVal === null || rawVal === undefined;
    if (op === DynamicDataFilterOperator.IsNotNull) return rawVal !== null && rawVal !== undefined;
    if (op === DynamicDataFilterOperator.IsEmpty)
      return rawVal === '' || rawVal === null || rawVal === undefined;
    if (op === DynamicDataFilterOperator.IsNotEmpty)
      return rawVal !== '' && rawVal !== null && rawVal !== undefined;

    if (rawVal === null || rawVal === undefined) return false;

    switch (op) {
      case DynamicDataFilterOperator.Equal:
        return String(rawVal).toLowerCase() === String(target).toLowerCase();
      case DynamicDataFilterOperator.NotEqual:
        return String(rawVal).toLowerCase() !== String(target).toLowerCase();
      case DynamicDataFilterOperator.Contains:
        return String(rawVal).toLowerCase().includes(String(target).toLowerCase());
      case DynamicDataFilterOperator.StartsWith:
        return String(rawVal).toLowerCase().startsWith(String(target).toLowerCase());
      case DynamicDataFilterOperator.EndsWith:
        return String(rawVal).toLowerCase().endsWith(String(target).toLowerCase());
      case DynamicDataFilterOperator.GreaterThan:
        return Number(rawVal) > Number(target);
      case DynamicDataFilterOperator.GreaterThanOrEqual:
        return Number(rawVal) >= Number(target);
      case DynamicDataFilterOperator.LessThan:
        return Number(rawVal) < Number(target);
      case DynamicDataFilterOperator.LessThanOrEqual:
        return Number(rawVal) <= Number(target);
      case DynamicDataFilterOperator.Between:
        return Number(rawVal) >= Number(target) && Number(rawVal) <= Number(targetTo);
      case DynamicDataFilterOperator.In:
        return Array.isArray(target) ? target.includes(rawVal) : false;
      default:
        return true;
    }
  }
}
