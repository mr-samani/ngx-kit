import { GridItemConfig } from '../options/grid-item-config';
import type { CompactMode } from '../options/options';
import { LayoutNode, collides, getFirstCollision } from './collision';

export interface MoveOptions {
  cols: number;
  compact: CompactMode;
  allowOverlap: boolean;
  maxRows?: number;
}

function isStatic(node: LayoutNode): boolean {
  return !!node.config.static;
}

function clampToCols(config: GridItemConfig, cols: number): void {
  config.w = Math.min(Math.max(1, config.w), cols);
  config.x = Math.max(0, Math.min(config.x, cols - config.w));
  config.y = Math.max(0, config.y);
}

function clone<T extends LayoutNode>(items: readonly T[]): T[] {
  return items.map((i) => ({ ...i, config: { ...i.config } })) as T[];
}

/**
 * Moves `id` to grid cell (x, y) and, unless overlap is explicitly allowed,
 * cascades any resulting collisions by pushing the colliding items out of the
 * way (downward for vertical-flow grids, rightward for horizontal-flow ones).
 * Static items are treated as fixed obstacles: they block, but never move.
 * Pure function — returns a new array, never mutates its input.
 */
export function moveItem<T extends LayoutNode>(
  items: readonly T[],
  id: string,
  x: number,
  y: number,
  opts: MoveOptions,
  depth = 0,
): T[] {
  let arr = clone(items);
  const item = arr.find((i) => i.id === id);
  if (!item || isStatic(item)) return arr;

  item.config.x = x;
  item.config.y = y;
  clampToCols(item.config, opts.cols);

  if (opts.allowOverlap || depth > arr.length + 24) return arr;

  const order = [...arr].sort(compareForCompaction(opts.compact)).map((i) => i.id);
  for (const otherId of order) {
    if (otherId === id) continue;
    const mover = arr.find((i) => i.id === id)!;
    const other = arr.find((i) => i.id === otherId)!;
    if (isStatic(other) || !collides(mover.config, other.config)) continue;
    arr = pushAway(arr, mover, other, opts, depth + 1);
  }
  return arr;
}

function pushAway<T extends LayoutNode>(items: T[], mover: T, blocked: T, opts: MoveOptions, depth: number): T[] {
  const targetX = opts.compact === 'horizontal' ? mover.config.x + mover.config.w : blocked.config.x;
  const targetY = opts.compact === 'horizontal' ? blocked.config.y : mover.config.y + mover.config.h;
  return moveItem(items, blocked.id, targetX, targetY, opts, depth);
}

function compareForCompaction(mode: CompactMode) {
  return (a: LayoutNode, b: LayoutNode) =>
    mode === 'horizontal'
      ? a.config.x - b.config.x || a.config.y - b.config.y
      : a.config.y - b.config.y || a.config.x - b.config.x;
}

/**
 * When the actively-moved item directly overlaps exactly one same-size item,
 * exchanging their positions reads much better than a cascading push. The
 * caller (service) decides when to offer this vs. falling back to `moveItem`.
 */
export function trySwap<T extends LayoutNode>(
  items: readonly T[],
  id: string,
  previous: GridItemConfig,
  next: GridItemConfig,
): T[] | null {
  const collisions = items.filter((i) => i.id !== id && !isStatic(i) && collides(i.config, next));
  if (collisions.length !== 1) return null;
  const [target] = collisions;
  if (target.config.w !== next.w || target.config.h !== next.h) return null;
  const arr = clone(items);
  const mover = arr.find((i) => i.id === id)!;
  const other = arr.find((i) => i.id === target.id)!;
  mover.config.x = next.x;
  mover.config.y = next.y;
  other.config.x = previous.x;
  other.config.y = previous.y;
  return arr;
}

/**
 * Removes gaps by pulling every non-static item as far toward the start of the
 * grid as it can go without overlapping another item, in reading order.
 */
export function compact<T extends LayoutNode>(items: readonly T[], mode: CompactMode): T[] {
  const arr = clone(items);
  if (mode === 'none') return arr;
  const canX = mode === 'horizontal' || mode === 'both';
  const canY = mode === 'vertical' || mode === 'both';
  const sorted = [...arr].sort((a, b) => a.config.y - b.config.y || a.config.x - b.config.x);
  for (const item of sorted) {
    if (isStatic(item)) continue;
    if (canY) {
      let y = item.config.y;
      while (y > 0 && !getFirstCollision(arr, item.id, { ...item.config, y: y - 1 })) y--;
      item.config.y = y;
    }
    if (canX) {
      let x = item.config.x;
      while (x > 0 && !getFirstCollision(arr, item.id, { ...item.config, x: x - 1 })) x--;
      item.config.x = x;
    }
  }
  return arr;
}

/** Highest occupied row (0-based, exclusive) across all items — drives the grid's auto-height. */
export function maxOccupiedRow(items: readonly LayoutNode[]): number {
  return items.reduce((max, i) => Math.max(max, i.config.y + i.config.h), 0);
}
