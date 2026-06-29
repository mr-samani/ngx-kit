import {  MsView } from "../models/view";
import { IOutputDate } from "./IOutputDate";

export interface IDateAdapter {
    get longMonths(): string[];
    get narrowDays(): string[];
    get shortDays(): string[];
    get longDays(): string[];
    startOfWeek: number;

    get today(): {
        locale: string,
        day: number,
        month: number,
        year: number
    };

    /**
     *  getting first day of month
     * 
     * شماره  اولین روز از ماه 
     * * مثلا 0 یعنی شنبه
     */
    firstDayofMonth(year: number, month: number): number;
    /**
     * getting last date of month
     * 
     * این ماه چند روز است 
     * * آخرین روز ماه جندم می شود؟
     */
    lastDateofMonth(year: number, month: number): number;

    /**
     * getting last day of month
     *  
     * شماره  آخرین روز از ماه 
     * * مثلا 0 یعنی شنبه
     */
    lastDayofMonth(year: number, month: number): number;

    /**
     * getting last date of previous month
     * 
     * آخرین روز از ماه گذشته 
     * * ماه قبل چند روز بوده است؟
     */
    lastDateofLastMonth(year: number, month: number): number;




    getDate(date: IOutputDate): Date;
    getOutputDate(date: Date): IOutputDate;


    formatDate(date: IOutputDate, format: string): string | null;

    getStartOf(date: Date | null, t:  MsView): Date | null;
    getLastOf(date: Date | null, t:  MsView): Date | null;
}