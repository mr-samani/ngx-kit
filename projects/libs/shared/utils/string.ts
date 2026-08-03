export function randomStrnig(extraLength = 4, useNumeric = false) {
  const len = Math.max(0, Math.floor(extraLength));
  if (len === 0) return '';

  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumeric) {
    charset += '0123456789';
  }
  const cryptoObj =
    typeof globalThis !== 'undefined'
      ? (globalThis as unknown as { crypto?: Crypto }).crypto
      : undefined;
  const out: string[] = new Array(len);

  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(len);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < len; i++) {
      out[i] = charset[bytes[i] % charset.length];
    }
  } else {
    for (let i = 0; i < len; i++) {
      out[i] = charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return `${Date.now().toString(36)}-${out.join('')}`;
}
