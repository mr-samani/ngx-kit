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

  const compareFn = compareForCompaction(opts.compact);
  let guard = 0;
  while (guard++ < arr.length + 24) {
    const mover = arr.find((i) => i.id === id)!;
    const staticBlocker = arr.find(
      (i) => i.id !== id && isStatic(i) && collides(mover.config, i.config),
    );
    if (staticBlocker) {
      if (opts.compact === 'horizontal') {
        mover.config.x = staticBlocker.config.x + staticBlocker.config.w;
      } else {
        mover.config.y = staticBlocker.config.y + staticBlocker.config.h;
      }
      clampToCols(mover.config, opts.cols);
      continue; // the new position may collide with something else — re-check from the top.
    }

    const blockers = arr
      .filter((i) => i.id !== id && !isStatic(i) && collides(mover.config, i.config))
      .sort(compareFn);
    if (blockers.length === 0) break;
    arr = pushAway(arr, mover, blockers[0], opts, depth + 1);
  }
  return arr;
}

function pushAway<T extends LayoutNode>(
  items: T[],
  mover: T,
  blocked: T,
  opts: MoveOptions,
  depth: number,
): T[] {
  const targetX =
    opts.compact === 'horizontal' ? mover.config.x + mover.config.w : blocked.config.x;
  const targetY =
    opts.compact === 'horizontal' ? blocked.config.y : mover.config.y + mover.config.h;
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
  if (items.some((i) => i.id !== id && isStatic(i) && collides(i.config, next))) return null;
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

/**
 * Finds a cell for `config` that doesn't collide with any existing item.
 * Tries the requested (x, y) first; if that's already occupied, scans
 * forward in reading order (row by row, top to bottom, left to right — the
 * caller is responsible for any RTL flipping when it turns this back into
 * pixels) for the first gap large enough to fit it.
 *
 * This is what a newly-registered item (or one whose config changes to a
 * position that's no longer free) should go through instead of silently
 * overlapping whatever's already there: unlike a drag/resize, registering an
 * item isn't a deliberate "make room for me" gesture, so relocating the new
 * item to open space reads far better than shoving already-placed items
 * around to accommodate it.
 */
export function findFreeSpot<T extends LayoutNode>(
  items: readonly T[],
  config: GridItemConfig,
  cols: number,
  excludeId?: string,
): { x: number; y: number } {
  const others = excludeId ? items.filter((i) => i.id !== excludeId) : items;
  const fits = (x: number, y: number) => !others.some((i) => collides(i.config, { ...config, x, y }));

  const startX = Math.max(0, Math.min(config.x, cols - config.w));
  const startY = Math.max(0, config.y);
  if (fits(startX, startY)) return { x: startX, y: startY };

  // The row just past the current bottom is always fully empty, so this loop
  // is guaranteed to find a fit no later than `maxY`.
  const maxY = maxOccupiedRow(others) + 1;
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= cols - config.w; x++) {
      if (fits(x, y)) return { x, y };
    }
  }
  return { x: startX, y: maxY + 1 };
}
