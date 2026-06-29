// Date and Time Patterns

import { IOutputDate } from "../adapters/IOutputDate";

// yy = 2-digit year; yyyy = full year

// M = digit month; MM = 2-digit month; MMM = short month name; MMMM = full month name

// EEEE = full weekday name; EEE = short weekday name

// d = digit day; dd = 2-digit day

// h = hours am/pm; hh = 2-digit hours am/pm; H = hours; HH = 2-digit hours

// m = minutes; mm = 2-digit minutes; aaa = AM/PM

// s = seconds; ss = 2-digit seconds

// S = miliseconds


export function genFormatDate(date: IOutputDate, patternStr: string, monthNames: string[], dayOfWeekNames: string[]) {
    if (!date) {
        return '';
    }
    if (!patternStr) {
        patternStr = 'M/d/yyyy';
    }
    var day = date.day ?? 0,
        month = date.month ?? 0,
        year = date.year ?? 0,
        hour = date.hours ?? 0,
        minute = date.minutes ?? 0,
        second = date.seconds ?? 0,
        miliseconds = date.milliseconds ?? 0,
        h = hour % 12,
        hh = twoDigitPad(h),
        HH = twoDigitPad(hour),
        mm = twoDigitPad(minute),
        ss = twoDigitPad(second),
        aaa = hour < 12 ? 'AM' : 'PM',
        EEEE = dayOfWeekNames[date.dayOfWeek ? date.dayOfWeek - 1 : 0],
        EEE = EEEE.substring(0, 3),
        dd = twoDigitPad(day),
        M = month + 1,
        MM = twoDigitPad(M),
        MMMM = monthNames[month],
        MMM = MMMM.substring(0, 3),
        yyyy = year + "",
        yy = yyyy.substring(2, 2)
        ;
    // checks to see if month name will be used
    patternStr = patternStr
        .replace('hh', hh).replace('h', h.toString())
        .replace('HH', HH).replace('H', hour.toString())
        .replace('mm', mm).replace('m', minute.toString())
        .replace('ss', ss).replace('s', second.toString())
        .replace('S', miliseconds.toString())
        .replace('dd', dd).replace('d', day.toString())

        .replace('EEEE', EEEE).replace('EEE', EEE)
        .replace('yyyy', yyyy)
        .replace('yy', yy)
        .replace('aaa', aaa);
    if (patternStr.indexOf('MMM') > -1) {
        patternStr = patternStr
            .replace('MMMM', MMMM)
            .replace('MMM', MMM);
    }
    else {
        patternStr = patternStr
            .replace('MM', MM)
            .replace('M', M.toString());
    }
    return patternStr;
}
export function twoDigitPad(num: number): string {
    return num < 10 ? "0" + num : num.toString();
}


// console.log(formatDate(new Date())); // 12/19/2022
// console.log(formatDate(new Date(), 'dd-MMM-yyyy')); //OP's request 19-Dec-2022
// console.log(formatDate(new Date(), 'EEEE, MMMM d, yyyy HH:mm:ss.S aaa')); //  Monday, December 19, 2022 10:44:35.437 AM
// console.log(formatDate(new Date(), 'EEE, MMM d, yyyy HH:mm')); //Mon, Dec 19, 2022 10:44
// console.log(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss.S')); //2022-12-19 10:44:35.438
// console.log(formatDate(new Date(), 'M/dd/yyyy h:mmaaa')); //12/19/2022 10:44AM


