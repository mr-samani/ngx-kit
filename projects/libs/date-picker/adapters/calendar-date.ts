export interface CalendarDate {
    locale: string;
    year: number;
    month?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    dayOfWeek?: number;
}