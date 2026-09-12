import { IPosition } from '../contracts/IPosition';

export function getPointerOnViewPort(evt: MouseEvent | TouchEvent | PointerEvent): IPosition {
  if (evt instanceof MouseEvent || evt instanceof PointerEvent) {
    return { x: evt.clientX, y: evt.clientY };
  }
  const touch = evt.targetTouches[0] || evt.changedTouches[0];
  return { x: touch.clientX, y: touch.clientY };
}
