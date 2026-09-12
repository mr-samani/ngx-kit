export type NgxInfiniteScrollDirection = 'up' | 'down' | 'both';

export interface NgxInfiniteScrollEvent {
  direction: 'up' | 'down';
  distance: number;
  target: HTMLElement;
  root: HTMLElement | null;
}
