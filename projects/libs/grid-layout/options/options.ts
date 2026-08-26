export type GridFlow = 'free' | 'horizontal' | 'vertical';
export type CompactMode = 'none' | 'vertical' | 'horizontal' | 'both';
export interface IGridBackgroundCfg {
  show?: 'never' | 'always' | 'whenDragging';
  borderColor?: string;
  gapColor?: string;
  rowColor?: string;
  columnColor?: string;
  borderWidth?: number;
}
export interface IGridLayoutOptions {
  cols: number;
  rowHeight: number | 'fit';
  gap?: number;
  padding?: number;
  flow?: GridFlow;
  compact?: CompactMode;
  allowOverlap?: boolean;
  pushItems?: boolean;
  dragThreshold?: number;
  animate?: boolean;
  rtl?: boolean | 'auto';
  gridBackgroundConfig?: IGridBackgroundCfg;
}
export class GridLayoutOptions implements IGridLayoutOptions {
  cols = 12;
  rowHeight: number | 'fit' = 50;
  gap = 8;
  padding = 0;
  flow = 'free' as GridFlow;
  compact = 'vertical' as CompactMode;
  allowOverlap = false;
  pushItems = true;
  dragThreshold = 3;
  animate = true;
  rtl = 'auto' as boolean | 'auto';
  gridBackgroundConfig: IGridBackgroundCfg = {
    show: 'always' as const,
    borderColor: 'rgba(128,128,128,.16)',
    gapColor: 'transparent',
    rowColor: 'rgba(128,128,128,.07)',
    columnColor: 'rgba(128,128,128,.07)',
    borderWidth: 1,
  };
}
