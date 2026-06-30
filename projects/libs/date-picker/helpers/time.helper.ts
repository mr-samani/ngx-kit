/**
 * convert 300s to 5:00
 */
export function convertSecondsToTime(givenSeconds: number): string {
  const dateObj = new Date(givenSeconds * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  const h = hours > 0 ? hours.toString().padStart(2, '0') + ':' : '';
  const timeString =
    h + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

  return timeString;
}
/**
 * convert 0 to 00:00 , 1 to 01:00 , 1.5 => 01:30
 */
export function convertNumberToTime(num: number): string {
  const hour = Math.floor(num);
  const min = 60 * (num - hour);

  const t = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  return t;
}
