import { PaginationLabel } from './PaginationLabel';

export interface PaginationConfigs {
  labels: PaginationLabel;
  pageSizeOptions: number[];
  defaultPageSize: number;
}
