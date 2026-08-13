import { RendererRegistry, TableCellFormatter } from './table-field.types';

export interface TableLabels {
  operation?: string;
  noData?: string;
  loading?: string;
}

export interface ColumnSizingConfig {
  /** حداقل عرض (px) که برای همه‌ی ستون‌های resizable اعمال می‌شود مگر این‌که ستون خودش override کند. */
  minWidth: number;
  /** حداکثر عرض (px). */
  maxWidth: number;
  /** عرض پیش‌فرض وقتی ستون width مشخص نکرده و کاربر هم دستی ریسایز نکرده. */
  defaultWidth: number;
}

export interface NgxTableOptions {
  showRecordNumber?: boolean;
  labels?: TableLabels;
  /** فعال‌سازی سورت چندستونه با Ctrl/Shift+Click. */
  multiSort?: boolean;
  resizable?: boolean;
  stripedRows?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  column?: ColumnSizingConfig;
  /** رجیستری رندررهای سراسری. با defineRenderers({...}) بسازید. */
  renderers?: RendererRegistry;
  formatters?: Readonly<Record<string, TableCellFormatter<any>>>;
}

export type ResolvedTableOptions = Required<
  Omit<NgxTableOptions, 'labels' | 'renderers' | 'formatters'>
> & {
  labels: Required<TableLabels>;
  renderers: RendererRegistry;
  formatters: Readonly<Record<string, TableCellFormatter<any>>>;
  lazy: boolean;
};
