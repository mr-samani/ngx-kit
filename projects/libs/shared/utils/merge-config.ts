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
    return base;
  }

  if (base === undefined) {
    return override;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    return [...override];
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, any> = {};

    const keys = new Set([...Object.keys(base), ...Object.keys(override)]);

    for (const key of keys) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      result[key] = merge(base[key], override[key]);
    }

    return result;
  }

  // Primitive / Function / Class / Date / RegExp ...
  return override;
}
