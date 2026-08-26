export function moveItemInArray<T>(array: T[], from: number, to: number): void {
  const f = clamp(from, array.length - 1);
  const t = clamp(to, array.length - 1);
  if (f === t) return;
  const target = array[f];
  const delta = t < f ? -1 : 1;
  for (let i = f; i !== t; i += delta) array[i] = array[i + delta];
  array[t] = target;
}

export function transferArrayItem<T>(src: T[], dst: T[], from: number, to: number): void {
  const f = clamp(from, src.length - 1);
  const t = clamp(to, dst.length);
  if (src.length) dst.splice(t, 0, src.splice(f, 1)[0]);
}
/**
 * Copies an item from one array to another, leaving it in its
 * original position in current array.
 * @param currentArray Array from which to copy the item.
 * @param targetArray Array into which is copy the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 *
 */
export function copyArrayItem<T = any>(
  currentArray: T[],
  targetArray: T[],
  currentIndex: number,
  targetIndex: number
): void {
  const to = clamp(targetIndex, targetArray.length);

  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray[currentIndex]);
  }
}

function clamp(v: number, max: number) {
  return Math.max(0, Math.min(max, v));
}
