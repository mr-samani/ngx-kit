export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export interface IResizableOutput {
  width: number;
  height: number;
  moveLeft: number;
  moveTop: number;
  left: number;
  top: number;
  direction: ResizeDirection;
}
