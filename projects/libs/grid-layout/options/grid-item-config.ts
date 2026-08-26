export class GridItemConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;

  constructor(x: number = 0, y: number = 0, w: number = 1, h: number = 1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
export const normalizeGridItem = (value?: Partial<GridItemConfig>): GridItemConfig => ({
  x: Math.max(0, Math.floor(value?.x ?? 0)),
  y: Math.max(0, Math.floor(value?.y ?? 0)),
  w: Math.max(1, Math.floor(value?.w ?? 1)),
  h: Math.max(1, Math.floor(value?.h ?? 1)),
  minW: value?.minW,
  minH: value?.minH,
  maxW: value?.maxW,
  maxH: value?.maxH,
});
