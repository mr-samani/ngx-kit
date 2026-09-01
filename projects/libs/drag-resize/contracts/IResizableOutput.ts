/** Physical (viewport-space) resize directions — always in LTR screen coordinates. */
export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

/**
 * Logical (writing-direction aware) resize directions.
 * `start`/`end` resolve to `w`/`e` depending on the host's computed `direction`,
 * so a single template works unchanged in both LTR and RTL layouts.
 */
export type LogicalResizeDirection =
  | ResizeDirection
  | 'n-start'
  | 'n-end'
  | 's-start'
  | 's-end'
  | 'start'
  | 'end';

export interface IResizableOutput {
  width: number;
  height: number;
  moveLeft: number;
  moveTop: number;
  left: number;
  top: number;
  direction: ResizeDirection;
}
