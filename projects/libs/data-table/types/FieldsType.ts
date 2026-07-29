import { TableCellFormatter } from './TableOptions';

export class FieldsType<T extends Object> {
  title!: string;
  column!: Extract<keyof T, string>;
  dataType?:
    | 'text'
    | 'image'
    | 'profilePicture'
    | 'date'
    | 'time'
    | 'dateTime'
    | 'yesNo'
    | 'boolean'
    | 'number'
    | 'localize'
    | 'template'
    | 'enum'
    | 'html'
    | 'userAgent'
    | undefined;
  width?: number;
  wrap?: boolean;

  prefix?: string;

  /**
   * نام renderer ثبت‌شده در provideTable
   */
  renderer?: string;

  /**
   * ورودی‌های اضافه برای renderer
   */
  rendererInputs?: Record<string, unknown>;

  /**
   * نام formatter سراسری یا تابع اختصاصی
   */
  formatter?: string | TableCellFormatter;
}

export class SortEvent {
  field: string = '';
  direction: 'asc' | 'desc' = 'asc';
}
