import { EventEmitter } from '@angular/core';

export type MessageOutput<T = any> = {
  id: number;
  close: () => void;
  afterClose: EventEmitter<MessageResult>;
};
export interface MessageResult<T = any> {
  readonly isConfirmed: boolean;
  readonly isDenied: boolean;
  readonly isDismissed: boolean;
  /**
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  readonly value?: T;
  readonly dismiss?: DismissReason;
}

/**
 * An enum of possible reasons that can explain an alert dismissal.
 */
export enum DismissReason {
  cancel,
  backdrop,
  close,
  /**
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  esc,
  /**
   * @description ❌⚠️NOT Implemented!⚠️❌
   */
  timer,
}
