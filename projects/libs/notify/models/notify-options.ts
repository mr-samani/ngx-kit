import { NgxNotifyPositionType } from './notify.model';

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
  position?: NgxNotifyPositionType;
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
   * close on tap notify
   * @default true
   */
  closeOnTap?: boolean;
  /**
   * Additional container class
   */
  containerClass?: string;
  /**
   * Additional notification class
   */
  notificationClass?: string;
}
