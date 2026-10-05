import { GradientStop, GradientType } from '../contracts/GradientStop';

export function buildGradientFromStops(
  stops: GradientStop[],
  type: GradientType = 'linear',
  rotation: number | string = 0,
  options = '',
): string {
  if (!stops?.length) return '';

  const sorted = [...stops].sort((a, b) => a.value - b.value);
  const parts = sorted.map((stop) => {
    const value = Math.max(0, Math.min(Number(stop.value) || 0, 100));
    return `${stop.color.trim()} ${value}%`;
  });

  const kind = type.replace('repeating-', '');
  let prefix = options.trim();
  if (!prefix && kind === 'linear') {
    prefix = typeof rotation === 'number' ? `${rotation}deg` : rotation.trim();
  } else if (!prefix && kind === 'radial') {
    prefix = typeof rotation === 'string' && rotation.trim() ? rotation.trim() : 'circle';
  } else if (!prefix && kind === 'conic') {
    prefix = typeof rotation === 'number' ? `from ${rotation}deg` : rotation.trim();
  }

  return `${type}-gradient(${prefix ? `${prefix}, ` : ''}${parts.join(', ')})`;
}

export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

export function isValidGradient(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^\s*(?:repeating-)?(?:conic|linear|radial)-gradient\s*\(/i.test(value)
  );
}

export function parseGradient(value: string): {
  type: GradientType;
  rotation: number;
  options: string;
  shape?: string;
  stops: GradientStop[];
  valid: boolean;
} {
  let type: GradientType = 'linear';
  let rotation = 180;
  let options = '';
  let shape: string | undefined;
  const stops: GradientStop[] = [];
  let valid = false;

  if (!value) return { type, rotation, options, shape, stops, valid };
  const match = value
    .trim()
    .match(/^((?:repeating-)?(?:conic|linear|radial))-gradient\s*\((.*)\)$/i);
  if (!match) return { type, rotation, options, shape, stops, valid };

  type = match[1].toLowerCase() as GradientType;
  const parts = splitGradientArguments(match[2]);
  const first = parts[0] ?? '';
  const kind = type.replace('repeating-', '');
  const hasPrelude =
    kind === 'linear'
      ? /^(?:to\s+|in\s+|[-+]?(?:\d*\.)?\d+(?:deg|grad|rad|turn)\b)/i.test(first)
      : kind === 'radial'
        ? /^(?:(?:circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner)\b|at\s+)/i.test(
            first,
          ) || !parseColorStop(first)
        : /^(?:from\s+|at\s+)/i.test(first) || !parseColorStop(first);

  let firstStop = 0;
  if (hasPrelude) {
    options = first;
    firstStop = 1;
    const angle = first.match(/(?:from\s+)?([-+]?(?:\d*\.)?\d+)(deg|grad|rad|turn)\b/i);
    if (angle) rotation = angleToDegrees(Number(angle[1]), angle[2]);
    if (kind === 'radial') shape = first;
  } else if (kind === 'conic') {
    rotation = 0;
  }

  for (let i = firstStop; i < parts.length; i++) {
    const parsed = parseColorStop(parts[i]);
    if (!parsed) continue;

    let position = parsed.position;
    if (position === undefined) {
      position =
        stops.length === 0
          ? 0
          : i === parts.length - 1
            ? 100
            : (100 / (parts.length - firstStop - 1)) * stops.length;
    }
    stops.push({ color: parsed.color, value: position, id: generateId(stops) });
  }

  valid = stops.length >= 2;
  return { type, rotation, options, shape, stops, valid };
}

function splitGradientArguments(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) {
      parts.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function parseColorStop(value: string): { color: string; position?: number } | undefined {
  const stop = value.trim();
  const positionMatch = stop.match(/\s+([-+]?(?:\d*\.)?\d+)%?$/);
  const color = positionMatch ? stop.slice(0, positionMatch.index).trim() : stop;
  if (!/^(?:#[\da-f]{3,8}|[a-z][\w-]*|[a-z][\w-]*\()/i.test(color)) return undefined;

  if (color.includes('(')) {
    let depth = 0;
    for (const char of color) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      if (depth < 0) return undefined;
    }
    if (depth !== 0 || !/\)$/.test(color)) return undefined;
  }

  return { color, position: positionMatch ? Number.parseFloat(positionMatch[1]) : undefined };
}

function angleToDegrees(value: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'turn':
      return value * 360;
    case 'grad':
      return value * 0.9;
    case 'rad':
      return value * (180 / Math.PI);
    default:
      return value;
  }
}

function generateId(stops: GradientStop[]): string {
  const id = 'ngx-stop-' + Math.random().toString(36).substring(2, 9);
  return stops.some((stop) => stop.id === id) ? generateId(stops) : id;
}
