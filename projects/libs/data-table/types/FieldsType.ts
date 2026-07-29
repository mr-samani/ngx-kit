export class FieldsType<T = any> {
  title!: string;
  column!: string;
  type?:
    | 'text'
    | 'image'
    | 'profilePicture'
    | 'date'
    | 'time'
    | 'dateTime'
    | 'yesNo'
    | 'number'
    | 'localize'
    | 'template'
    | 'enum'
    | 'html'
    | 'userAgent'
    | undefined;
  width?: number;
  wrap?: boolean;
  localizeKey?: string;

  prefix?: string;
}

export class SortEvent {
  field: string = '';
  direction: 'asc' | 'desc' = 'asc';
}
