import { MessageIcon } from './configs';
import { IMessageOptions } from './message-options.interface';


export class MessageOptions implements IMessageOptions {
  public constructor(private config?: IMessageOptions) {
    //config = { ...(new MessageOptions()), ...config };
  }
  /**
   * add popover manual to set alert dialog container to top layer
   * - usefull when using alert modal in angular material dialog
   *
   */
  useOverlay?: boolean;
  title?: string = '';
  text?: string = '';
  html?: string | HTMLElement = '';
  backdrop?: boolean = true;
  icon?: MessageIcon;
  width?: number | string;
  allowOutsideClick?: boolean = true;
  allowEscapeKey?: boolean = true;
  allowEnterKey?: boolean = true;
  showConfirmButton?: boolean = true;
  showDenyButton?: boolean = false;
  showCancelButton?: boolean = false;
  confirmButtonText: string = 'Ok';
  denyButtonText?: string = 'No';
  cancelButtonText?: string = 'Cancel';
  confirmButtonColor?: string;
  denyButtonColor?: string;
  cancelButtonColor?: string;
  confirmButtonAriaLabel?: string = '';
  denyButtonAriaLabel?: string = '';
  cancelButtonAriaLabel?: string = '';
  reverseButtons?: boolean = false;
  showCloseButton?: boolean = false;
  containerClass?: string = '';
}
