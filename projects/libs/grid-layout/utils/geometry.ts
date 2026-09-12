import { GridItemConfig } from '../options/grid-item-config';
import { IGridLayoutOptions } from '../options/options';

/**
 * All pixel <-> grid-cell math lives here, in one RTL-aware place.
 *
 * Grid coordinates are always *logical* (reading-order): x = 0 is the first
 * column in the direction text flows — the left edge in LTR, the right edge
 * in RTL. Every physical (CSS `left`/pixel) calculation goes through here so
 * the rest of the codebase never has to think about direction again.
 */
export interface GridMetrics {
  /** Inner content width available for columns (container width minus padding). */
  contentWidth: number;
  colWidth: number;
  rowHeight: number;
  gap: number;
  padding: number;
}

export function computeMetrics(containerWidth: number, options: IGridLayoutOptions): GridMetrics {
  const cols = Math.max(1, Math.floor(options.cols));
  const gap = options.gap ?? 0;
  const padding = options.padding ?? 0;
  const contentWidth = Math.max(0, containerWidth - padding * 2);
  const colWidth = Math.max(1, (contentWidth - gap * (cols - 1)) / cols);
  const rowHeight = options.rowHeight === 'fit' ? Math.max(1, colWidth) : Math.max(1, options.rowHeight);
  return { contentWidth, colWidth, rowHeight, gap, padding };
}

/** Physical CSS `left` (px, relative to the grid surface's content box) for a logical column. */
export function colToLeft(colIndex: number, spanCols: number, m: GridMetrics, rtl: boolean): number {
  if (!rtl) return m.padding + colIndex * (m.colWidth + m.gap);
  const widthPx = spanCols * m.colWidth + (spanCols - 1) * m.gap;
  const rightEdge = m.padding + colIndex * (m.colWidth + m.gap);
  return m.contentWidth + m.padding - rightEdge - widthPx;
}

export function rowToTop(rowIndex: number, m: GridMetrics): number {
  return m.padding + rowIndex * (m.rowHeight + m.gap);
}

export function spanToWidthPx(spanCols: number, m: GridMetrics): number {
  return spanCols * m.colWidth + Math.max(0, spanCols - 1) * m.gap;
}

export function spanToHeightPx(spanRows: number, m: GridMetrics): number {
  return spanRows * m.rowHeight + Math.max(0, spanRows - 1) * m.gap;
}

/** Physical left px (as above) -> nearest logical column index. Inverse of `colToLeft`. */
export function leftToCol(leftPx: number, spanCols: number, m: GridMetrics, rtl: boolean): number {
  if (!rtl) return Math.round((leftPx - m.padding) / (m.colWidth + m.gap));
  const widthPx = spanCols * m.colWidth + (spanCols - 1) * m.gap;
  const rightEdge = m.contentWidth + m.padding - leftPx - widthPx;
  return Math.round((rightEdge - m.padding) / (m.colWidth + m.gap));
}

export function topToRow(topPx: number, m: GridMetrics): number {
  return Math.round((topPx - m.padding) / (m.rowHeight + m.gap));
}

/** Places an item's pixel box (left/top/width/height) inside the grid surface, RTL-aware. */
export function placeItem(config: GridItemConfig, m: GridMetrics, rtl: boolean): { left: number; top: number; width: number; height: number } {
  return {
    left: colToLeft(config.x, config.w, m, rtl),
    top: rowToTop(config.y, m),
    width: spanToWidthPx(config.w, m),
    height: spanToHeightPx(config.h, m),
  };
}
