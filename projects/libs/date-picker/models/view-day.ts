import { MsEvents } from './events';
import { MsDATE } from './date';




export class DatePickerViewDay extends MsDATE {
  day!: number;
  events?: MsEvents[];
}
