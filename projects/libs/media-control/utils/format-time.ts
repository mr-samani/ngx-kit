/**
 * Format time in seconds as MM:SS
 * @param seconds number
 * @returns MM:SS
 */
export function formatTime(seconds: number) {
    if (Number.isNaN(+seconds) || seconds == Infinity) {
        seconds = 0; //  return 'Unknown';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}