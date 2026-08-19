import { MsEvents } from './events';

export type CalendarEventInteractionType = 'move' | 'resize-start' | 'resize-end';

export interface CalendarEventChange {
  event: MsEvents;
  previousEvent: MsEvents;
  interaction: CalendarEventInteractionType;
  deltaDays: number;
  deltaMinutes: number;
}
