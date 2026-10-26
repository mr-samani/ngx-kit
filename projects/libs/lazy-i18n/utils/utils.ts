import type { Dictionary, Params } from '../types/types';

/** Flatten a nested dictionary into `target` (dot-separated keys). Non-string leaves are stringified. */
export function flatten(
  dict: Dictionary,
  target: Map<string, string> = new Map(),
  onConflict?: (key: string) => void,
  prefix = '',
): Map<string, string> {
  for (const k of Object.keys(dict)) {
    const v = (dict as Record<string, unknown>)[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') {
      flatten(v as Dictionary, target, onConflict, key);
    } else if (v !== null && v !== undefined) {
      const s = String(v);
      if (onConflict) {
        const prev = target.get(key);
        if (prev !== undefined && prev !== '' && s !== '' && prev !== s) onConflict(key);
      }
      target.set(key, s);
    }
  }
  return target;
}

const RE = /\{\{\s*([\w$.-]+)\s*\}\}/g;

function getPath(obj: Params, path: string): unknown {
  if (path in obj) return obj[path];
  let cur: any = obj;
  for (const part of path.split('.')) {
    if (cur == null) return undefined;
    cur = cur[part];
  }
  return cur;
}

/** `Hello {{ name }}` + `{name:'Ali'}` -> `Hello Ali`. Unknown placeholders are left untouched. */
export function interpolate(text: string, params?: Params): string {
  if (!params || text.indexOf('{{') === -1) return text; // fast path: no regex
  return text.replace(RE, (m, k: string) => {
    const v = getPath(params, k);
    return v == null ? m : String(v);
  });
}

export function shallowEqual(a?: Params, b?: Params): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
}

export const RTL_LANGS = new Set(['ar', 'fa', 'he', 'ur', 'ps', 'sd', 'ug', 'yi', 'ckb', 'dv']);

/** Identity function the extractor recognises: `const k = marker('orders.title')`. */
export function marker<T extends string>(key: T): T {
  return key;
}
