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
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  inRangePreview?: boolean;
}

export class DateViewWeek extends DateModel {
  time!: number;
  weeks: string[] = [];
  displayTime!: string;
}

export interface CalendarDayColumn {
  date: Date;
  label: string;
  dayNumber: string;
  isToday: boolean;
  events: CalendarTimedEvent[];
}

export interface CalendarTimedEvent extends MsEventViewer {
  start: Date;
  end: Date;
  top: number;
  height: number;
  allDay: boolean;
  column: number;
  columnCount: number;
}
