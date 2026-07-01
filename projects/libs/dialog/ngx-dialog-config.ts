import { Injector } from '@angular/core';

export class NgxDialogConfig<DataType = any> {
  /**
   * pass data to dialog
   */
  data?: DataType | any = {};
  /** close dialog on outside click
   * - default false */
  allowCloseOnOutsideClick?: boolean = false;
  /**
   * container class
   * - You can separate the list of classes with a space
   * - for example:"`my class one two three ...`"
   *
   * TODO: must set with public config setter
   */
  containerClass? = 'ngx-kit';
  header?: {
    enable?: true;
    title?: '';
    showCloseButton?: true;
  };
  footer?: {
    enable?: true;
  };
  width?: string = '';
  minWidth?: string = '';
  maxWidth?: string = '';
  height?: string = '';
  minHeight?: string = '';
  maxHeight?: string = '';

  /** parent injector */
  injector?: Injector;

  constructor() {}
}
