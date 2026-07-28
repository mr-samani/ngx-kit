import { DOCUMENT, inject } from '@angular/core';

export function IsRtl() {
  const doc = inject(DOCUMENT);
  return getComputedStyle(doc.documentElement).direction === 'rtl';
}
