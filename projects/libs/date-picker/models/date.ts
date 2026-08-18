import { MsEventViewer } from './events';

export class DateModel<InputDate = Date> {
  date?: InputDate;
  active?: boolean;
  isToday?: boolean;
  selected?: boolean;
}

export class DateViewYear extends DateModel {
  year!: number;
}

export class DateViewMonth extends DateModel {
  month!: number;
  displayMonth!: string;
}

export class DateViewDay extends DateModel {
  day!: number;
  events?: MsEventViewer[];
  /** Date is inside the committed range. */
  inRange?: boolean;
  /** Range start/end markers. */
  rangeStart?: boolean;
  rangeEnd?: boolean;
  /** Date is inside the current hover preview. */
  inRangePreview?: boolean;
}

export class DateViewWeek extends DateModel {
  time!: number;
  weeks: string[] = [];
  displayTime!: string;
}
