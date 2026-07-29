import { MessageIcon } from './MessageIcon';

export interface IMessageOptions {
  /**
   * add popover manual to set alert dialog container to top layer
   * - usefull when using alert modal in angular material dialog
   *
   */
  useOverlay?: boolean;

  /**
   * The title of the popup
   *
   * @default ''
   */
  title?: string;

  /**
   * A description for the popup.
   *
   * @default ''
   */
  text?: string;

  /**
   * A HTML description for the popup.
   *
   * [Security] we does NOT sanitize this parameter. It is the developer's responsibility
   * to escape any user input when using the `html` option, so XSS attacks would be prevented.
   *
   * @default ''
   */
  html?: string | HTMLElement;

  /**
   * Whether or not  should show a full screen click-to-dismiss backdrop.
   * Either a boolean value or a css background value (hex, rgb, rgba, url, etc.)
   *
   * @default true
   */
  backdrop?: boolean;

  icon?: MessageIcon;

  /**
   * Popup width, including paddings (`box-sizing: border-box`).
   *
   * @default undefined
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  width?: number | string;

  /**
   * If set to `false`, the user can't dismiss the popup by clicking outside it.
   *
   * @default true
   */
  allowOutsideClick?: boolean;

  /**
   * If set to `false`, the user can't dismiss the popup by pressing the Escape key.
   *
   * @default true
   */
  allowEscapeKey?: boolean;

  /**
   * If set to `false`, the user can't confirm the popup by pressing the Enter or Space keys,
   * unless they manually focus the confirm button.
   *
   * @default true
   */
  allowEnterKey?: boolean;

  /**
   * If set to `false`, the "Confirm" button will not be shown.
   *
   * @default true
   */
  showConfirmButton?: boolean;

  /**
   * If set to `true`, the "Deny" button will be shown, which the user can click on to deny the popup.
   *
   * @default false
   */
  showDenyButton?: boolean;

  /**
   * If set to `true`, the "Cancel" button will be shown, which the user can click on to dismiss the popup.
   *
   * @default false
   */
  showCancelButton?: boolean;

  /**
   * Use this to change the text on the "Confirm" button.
   *
   * @default 'OK'
   */
  confirmButtonText?: string;

  /**
   * Use this to change the text on the "Confirm" button.
   *
   * @default 'No'
   */
  denyButtonText?: string;

  /**
   * Use this to change the text on the "Cancel" button.
   *
   * @default 'Cancel'
   */
  cancelButtonText?: string;

  /**
   * Use this to change the background color of the "Confirm" button.
   *
   * @default undefined
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  confirmButtonColor?: string;

  /**
   * Use this to change the background color of the "Deny" button.
   *
   * @default undefined
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  denyButtonColor?: string;

  /**
   * Use this to change the background color of the "Cancel" button.
   *
   * @default undefined
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  cancelButtonColor?: string;

  /**
   * Use this to change the `aria-label` for the "Confirm" button.
   *
   * @default ''
   */
  confirmButtonAriaLabel?: string;

  /**
   * Use this to change the `aria-label` for the "Deny" button.
   *
   * @default ''
   */
  denyButtonAriaLabel?: string;

  /**
   * Use this to change the `aria-label` for the "Cancel" button.
   *
   * @default ''
   */
  cancelButtonAriaLabel?: string;

  /**
   * Set to `true` if you want to invert default buttons positions.
   *
   * @default false
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  reverseButtons?: boolean;

  /**
   * Set to `true` to show close button.
   *
   * @default false
   */
  showCloseButton?: boolean;

  containerClass?: string;
}
