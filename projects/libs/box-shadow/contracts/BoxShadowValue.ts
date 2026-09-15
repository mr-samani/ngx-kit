export interface BoxShadow {
  inset?: boolean;
  xOffset: number;
  yOffset: number;
  blurRadius?: number;
  spreadRadius?: number;
  color: string;
  unit: string; // e.g., 'px', 'rem', 'em'

  cssValue?: string;
}
