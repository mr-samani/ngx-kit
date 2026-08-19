/**
 * Calendar event model.
 *
 * `end` is inclusive for day based calendar rendering.
 * `color` is used as the event accent color and can be overridden by
 * `backgroundColor`, `borderColor` and `textColor`.
 */
export interface MsEvents<DateInput = Date> {
  id?: string | number;
  title?: string;
  start: DateInput;
  end?: DateInput;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string | string[];
  data?: unknown;
}

export interface MsEventViewer<DateInput = Date> extends MsEvents<DateInput> {
  continuesBefore?: boolean;
  continuesAfter?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}
