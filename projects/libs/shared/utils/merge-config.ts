function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
  );
}

export function mergeConfig<T>(base: T, override?: Partial<T>): T {
  if (override == null) {
    return structuredClone(base);
  }

  return merge(base, override) as T;
}

function merge(base: any, override: any): any {
  if (override === undefined) {
    return structuredClone(base);
  }

  if (base === undefined) {
    return structuredClone(override);
  }

  // Array => replace
  if (Array.isArray(base) && Array.isArray(override)) {
    return structuredClone(override);
  }

  // Object => deep merge
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, any> = { ...base };

    for (const key of Object.keys(override)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      result[key] = merge(base[key], override[key]);
    }

    return result;
  }

  // Primitive / Date / RegExp / Function / ...
  return structuredClone(override);
}
