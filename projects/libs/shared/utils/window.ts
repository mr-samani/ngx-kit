import { inject, InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window | null>('WINDOW', {
  factory: () => (typeof window !== 'undefined' ? window : null),
});
