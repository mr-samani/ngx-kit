import { genFormatDate } from "../../helpers/date-format.helper";
import {  MsView } from "../../models/view";
import { IDateAdapter } from "../IAdapter";
import { CalendarDate } from "../calendar-date";

export class GregorianAdapter implements IDateAdapter {
    startOfWeek = 0;
    get longMonths() {
        return ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
    }
    get narrowDays() {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    get shortDays() {
        return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
    get longDays() {
        return [
            "Sunday", "Monday", "Tuesday",
            "Wednesday", "Thursday", "Friday", "Saturday"
        ];
    }
    today() {
        return {
            locale: 'en',
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        };
    }

    /**
     *  getting first day of month
     */
    firstDayofMonth(year: number, month: number) {
        return new Date(year, month, 1).getDay();
    }
    /**
     * getting last date of month
     */
    lastDateofMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }
    /**
     * getting last day of month
     */
    lastDayofMonth(year: number, month: number) {
        return new Date(year, month, this.lastDateofMonth(year, month)).getDay();
    }
    /**
     * getting last date of previous month
     */
    lastDateofLastMonth(year: number, month: number) {
        return new Date(year, month, 0).getDate();
    }

    // TODO
    /**
     * month start with zero
     * @param date 
     * @returns 
     */
    getDate(date: CalendarDate): Date {
        let str = date.year + '-' + (date.month ? (date.month + 1) : 1) + '-' + (date.day ?? 1);
        str = str.split('-').map(i => {
            return i.length < 2 ? '0' + i : i;
        }).join('-');
        if (date.hours || date.minutes || date.seconds || date.milliseconds) {
            str += ' ' + (date.hours ?? 0) + ':' + (date.minutes ?? 0) + ':' + (date.seconds ?? 0) + ':' + (date.milliseconds ?? 0);
        }
        return new Date(str);
    }
    getOutputDate(date: Date): CalendarDate {
        return {
            locale: 'en',
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds(),
            dayOfWeek: date.getDay()
        };
    }

    formatDate(date: CalendarDate, format: string) {
        if (!date) {
            return '';
        }
        // let option: Intl.DateTimeFormatOptions = {
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit'
        // };
        // if (format === 'full') {
        //     option = {
        //         year: 'numeric',
        //         month: 'long',
        //         day: '2-digit',
        //         weekday: 'long'
        //     };
        // }
        // return new Date(date).toLocaleDateString('en-US', option);
        return genFormatDate(date, format, this.longMonths, this.longDays);

    }
    getStartOf(date: Date | null, t:  MsView) {
        if (!date) {
            return date;
        }
        switch (t) {
            case 'year':
                return new Date(date.getFullYear(), 1, 1);
            case 'month':
                return new Date(date.getFullYear(), date.getMonth(), 1);
            case 'day':
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    }

    getLastOf(date: Date | null, t:  MsView) {
        if (!date) {
            return date;
        }
        switch (t) {
            case 'year':
                return new Date(date.getFullYear(), 12, 0);
            case 'month':
                return new Date(date.getFullYear(), date.getMonth() + 1, 0);
            case 'day':
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    }
}