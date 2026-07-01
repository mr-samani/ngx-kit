export interface NgxNotifyOptions {
  /**
   * Time out (ms)
   * - @default 3000
   */
  timeout?: number;

  /**
   * Notify position
   * @default top-center
   */
  position?:
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  /**
   * How many visible at once
   * queued, prevents overlap
   * @default 10
   */
  maxVisible?: number;
  /**
   * Whether message may contain HTML
   * @default false
   */
  allowHtml?: boolean;
  /**
   * Pause timeout when hovered
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Show close button
   * @default true
   */
  dismissible?: boolean;
  /**
   * Additional container class
   */
  containerClass?: string;
  /**
   * Additional notification class
   */
  notificationClass?: string;
}
