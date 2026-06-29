import { MsEvents } from './events';
import { MsDATE } from './date';




export class MsViewDay extends MsDATE {
  day!: number;
  events?: MsEvents[];
}
