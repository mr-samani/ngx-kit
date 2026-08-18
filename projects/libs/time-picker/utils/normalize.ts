export function normalizeTime(value: string): string | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return [hour.toString().padStart(2, '0'), minute.toString().padStart(2, '0')].join(':');
}
