export interface TableGlobalConfig {
  labels: TableLable;
  /** Enable multi-column sort by default (Ctrl/Shift + click) unless a table overrides it. */
  multiSort: boolean;
  resizable: boolean;
  stripedRows: boolean;
  hoverable: boolean;
  stickyHeader: boolean;
}

export interface TableLable {
operation: string;
  noData: string;
  loading: string;
}
