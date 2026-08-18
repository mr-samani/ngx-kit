/*********************************************************************
 * @function      : getPersianMonthInfo(date)
 * @purpose       : Returns information on a Persian Month for a given Gregorian Date
 * @version       : 1.00
 * @author        : Mohsen Alyafei
 * @date          : 07 Mar 2022
 * @Licence       : MIT
 * @param         : {date} a valid Gregorian Date Object
 * @returns       : An Array of seven (7) elements with the following data:
 *                  [0] The Gregorian Date (the input date) in YYYY-MM-DD format
 *                  [1] The Persian Day (Number) for that date
 *                  [2] The Persian Month (String)
 *                  [3] The Persian Year (Number)
 *                  [4] Total Days in the Persian Month (Number)
 *                  [5] The Gregorian Date that the Persian Month starts on (Date object)
 *                  [6] The Gregorian Date that the Persian Month ends on   (Date object)
 **********************************************************************/
export function getPersianMonthInfo(date: Date): IPersianMonthInfo {
  let sD = new Date(date),
    c = 'en-u-ca-persian-nu-latn',
    d = sD,
    gD = 0,
    tD = 0,
    pD;
  let n: 'numeric' | '2-digit' = 'numeric',
    iDay = new Intl.DateTimeFormat(c, { day: n }).format(sD),
    iMonth = new Intl.DateTimeFormat(c, { month: 'long' }).format(sD),
    iYear = new Intl.DateTimeFormat(c, { year: n }).format(sD).split(' ')[0];
  for (let i = 0; i < 32; i++) {
    pD = new Intl.DateTimeFormat(c, { day: n }).format(d);
    if (+pD > tD) ((tD = +pD), gD++);
    else break;
    d = new Date(d.setUTCDate(d.getUTCDate() + 1));
  }
  let gEndT = new Date(sD.setUTCDate(sD.getUTCDate() + gD - 2));
  return {
    gDate: new Date(date).toISOString().split('T')[0],
    jDay: +iDay,
    jMonth: +iMonth,
    jYear: +iYear,
    totalDayInMonth: tD,
    jStartOfMonth: new Date(gEndT.setUTCDate(gEndT.getUTCDate() - tD + 1)),
    jEndOfMonth: new Date(gEndT),
  };
}
//==================================================================

export interface IPersianMonthInfo {
  // Gregorian Date
  gDate: string;
  // Persian Day
  jDay: number;
  // Persian Month
  jMonth: number;
  // Persian Year
  jYear: number;
  // Total Days in Persian Month
  totalDayInMonth: number;
  // Persian Month Starts on
  jStartOfMonth: Date;
  // Persian Month Ends on
  jEndOfMonth: Date;
}

//==================================================================
// Test Cases
//==================================================================
// output(getPersianMonthInfo(new Date(Date.now()))); // today's date
// output(getPersianMonthInfo("2022-04-10"));         // 10 April 2022
//==================================================================

// function output([gDate, iDay, iMonth, iYear, tD, gStart, gEnd]) {

// console.log(`
// Gregorian Date              : ${gDate}
// Persian Day                 : ${iDay}
// Persian Month               : ${iMonth}
// Persian Year                : ${iYear}
// Total Days in Persian Month : ${tD}
// Persian Month Starts on     : ${gStart}
// Persian Month Ends on       : ${gEnd}
// `
// );
// }
//==================
