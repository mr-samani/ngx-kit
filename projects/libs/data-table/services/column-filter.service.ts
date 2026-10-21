import { Injectable } from '@angular/core';
import { ColumnFilterState, DynamicDataFilterOperator } from '../types/filter.type';

@Injectable({ providedIn: 'root' })
export class ColumnFilterService {
  applyFilters<T>(data: readonly T[], filters: Record<string, ColumnFilterState>): T[] {
    const activeFilters = Object.values(filters).filter((f) => this.isFilterActive(f));
    if (activeFilters.length === 0) return [...data];

    return data.filter((item) =>
      activeFilters.every((filter) => this.evaluateFilter(item, filter)),
    );
  }

  isFilterActive(filter?: ColumnFilterState | null): boolean {
    if (!filter) return false;
    const { operator, value, valueTo, values } = filter;
    const noValueOps = [
      DynamicDataFilterOperator.IsNull,
      DynamicDataFilterOperator.IsNotNull,
      DynamicDataFilterOperator.IsEmpty,
      DynamicDataFilterOperator.IsNotEmpty,
    ];
    if (noValueOps.includes(operator)) return true;

    if (operator === DynamicDataFilterOperator.Between) {
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        valueTo !== undefined &&
        valueTo !== null &&
        valueTo !== ''
      );
    }

    if (operator === DynamicDataFilterOperator.In) {
      return Array.isArray(values) && values.length > 0;
    }

    return value !== undefined && value !== null && value !== '';
  }

  private evaluateFilter(item: any, filter: ColumnFilterState): boolean {
    const rawVal = item?.[filter.field];
    const op = filter.operator;
    const target = filter.value;
    const targetTo = filter.valueTo;
    const targets = filter.values;

    if (op === DynamicDataFilterOperator.IsNull) return rawVal === null || rawVal === undefined;
    if (op === DynamicDataFilterOperator.IsNotNull) return rawVal !== null && rawVal !== undefined;
    if (op === DynamicDataFilterOperator.IsEmpty)
      return rawVal === '' || rawVal === null || rawVal === undefined;
    if (op === DynamicDataFilterOperator.IsNotEmpty)
      return rawVal !== '' && rawVal !== null && rawVal !== undefined;

    if (rawVal === null || rawVal === undefined) return false;

    if (
      rawVal instanceof Date ||
      (typeof rawVal === 'string' && !isNaN(Date.parse(rawVal)) && isNaN(Number(rawVal)))
    ) {
      const itemTime = new Date(rawVal).getTime();
      const targetTime = target ? new Date(target as string).getTime() : NaN;
      const targetToTime = targetTo ? new Date(targetTo as string).getTime() : NaN;

      if (!isNaN(itemTime)) {
        switch (op) {
          case DynamicDataFilterOperator.Equal:
            return new Date(rawVal).toDateString() === new Date(target as string).toDateString();
          case DynamicDataFilterOperator.GreaterThan:
            return itemTime > targetTime;
          case DynamicDataFilterOperator.GreaterThanOrEqual:
            return itemTime >= targetTime;
          case DynamicDataFilterOperator.LessThan:
            return itemTime < targetTime;
          case DynamicDataFilterOperator.LessThanOrEqual:
            return itemTime <= targetTime;
          case DynamicDataFilterOperator.Between:
            return itemTime >= targetTime && itemTime <= targetToTime;
        }
      }
    }

    switch (op) {
      case DynamicDataFilterOperator.Equal:
        return String(rawVal).trim().toLowerCase() === String(target).trim().toLowerCase();
      case DynamicDataFilterOperator.NotEqual:
        return String(rawVal).trim().toLowerCase() !== String(target).trim().toLowerCase();
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
        return Array.isArray(targets)
          ? targets.some((t) => String(t).toLowerCase() === String(rawVal).toLowerCase())
          : false;
      default:
        return true;
    }
  }
}
