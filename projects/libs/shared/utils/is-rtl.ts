
export function IsRtl(doc:Document) {
  return getComputedStyle(doc.documentElement).direction === 'rtl';
}
