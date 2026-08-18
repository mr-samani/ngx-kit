import { InjectionToken } from '@angular/core';

export class NgxTimePickerConfig {
  cancelButtonText: string = 'Cancel';
  confirmButtonText: string = 'Ok';
  amText: string = 'AM';
  pmText: string = 'PM';
  format: '12' | '24' = '12';
  minuteStep: number = 1;
  autoSwitchToMinute: boolean = true;
}

export const DEFAULT_TIME_PICKER_CONFIG = new NgxTimePickerConfig();
export const NGX_TIME_PICKER_CONFIG = new InjectionToken<NgxTimePickerConfig>(
  'ngx-time-picker-config',
  {
    factory: () => DEFAULT_TIME_PICKER_CONFIG,
  },
);
