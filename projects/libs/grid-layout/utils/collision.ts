import { GridItemConfig } from '../options/grid-item-config';

export interface LayoutNode {
  id: string;
  config: GridItemConfig;
}

/** Axis-aligned bounding-box overlap test in grid-cell space. */
export function collides(a: GridItemConfig, b: GridItemConfig): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** First item (other than `self`) whose cells overlap `config`, or null. */
export function getFirstCollision<T extends LayoutNode>(items: readonly T[], selfId: string, config: GridItemConfig): T | null {
  for (const item of items) {
    if (item.id === selfId) continue;
    if (collides(item.config, config)) return item;
  }
  return null;
}

/** All items whose cells overlap `config`, excluding `selfId`. */
export function getAllCollisions<T extends LayoutNode>(items: readonly T[], selfId: string, config: GridItemConfig): T[] {
  return items.filter((item) => item.id !== selfId && collides(item.config, config));
}
