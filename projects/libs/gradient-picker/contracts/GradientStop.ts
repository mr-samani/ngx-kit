export interface GradientStop {
  id: string;
  value: number; // مثلا 23 (موقعیت شروع رنگ)
  color: string; // مثل 'red' یا '#ff0000'
}

// prettier-ignore
export type GradientType =
  | 'linear'
  | 'radial'
  | 'conic'
  | 'repeating-linear'
  | 'repeating-radial'
  | 'repeating-conic';
