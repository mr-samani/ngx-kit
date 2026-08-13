import { Provider } from '@angular/core';
import {
  DEFAULT_TIME_PICKER_CONFIG,
  NGX_TIME_PICKER_CONFIG,
  type NgxTimePickerConfig,
} from '../types/config';

export function provideTimePicker(config: Partial<NgxTimePickerConfig>): Provider[] {
  const configuration = { ...DEFAULT_TIME_PICKER_CONFIG, ...config };
  return [
    {
      provide: NGX_TIME_PICKER_CONFIG,
      useValue: configuration,
    },
  ];
}
