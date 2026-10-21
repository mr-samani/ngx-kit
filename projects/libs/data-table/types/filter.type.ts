export enum DynamicDataFilterOperator {
  Equal = 0,
  NotEqual = 1,
  Contains = 2,
  StartsWith = 3,
  EndsWith = 4,
  GreaterThan = 5,
  GreaterThanOrEqual = 6,
  LessThan = 7,
  LessThanOrEqual = 8,
  Between = 9,
  In = 10,
  IsNull = 11,
  IsNotNull = 12,
  IsEmpty = 13,
  IsNotEmpty = 14,
}

export type FilterDataType = 'text' | 'number' | 'date' | 'boolean' | 'enum';

export interface EnumFilterOption<T = any> {
  label: string;
  value: T;
}

export interface ColumnFilterConfig<T = any> {
  type?: FilterDataType;
  enabled?: boolean;
  options?: EnumFilterOption[]; // برای حالت enum
}

export interface ColumnFilterState {
  field: string;
  operator: DynamicDataFilterOperator;
  value: any;
  valueTo?: any; // برای اپراتور Between
}
