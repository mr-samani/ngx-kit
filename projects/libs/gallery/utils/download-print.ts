/** دانلود تصویر با fetch→blob (نام‌گذاریِ درست فایل رو تضمین می‌کنه)؛ اگه CORS اجازه نداد، در تب جدید باز می‌شه */
export async function downloadImage(src: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(src, { mode: 'cors' });
    if (!response.ok) throw new Error('fetch failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || guessFileName(src);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(src, '_blank', 'noopener,noreferrer');
  }
}

function guessFileName(src: string): string {
  try {
    const url = new URL(src, typeof window !== 'undefined' ? window.location.href : undefined);
    const last = url.pathname.split('/').pop();
    return last || 'image';
  } catch {
    return 'image';
  }
}

/** یه پنجره‌ی جدید فقط با همون تصویر باز می‌کنه و بعد از لود، print می‌زنه؛ با DOM API (نه innerHTML) پس در برابر src مخرب امنه */
export function printImage(src: string): void {
  const win = window.open('', '_blank', 'noopener,noreferrer,width=800,height=600');
  if (!win) return;

  win.document.title = 'Print';
  const style = win.document.createElement('style');
  style.textContent =
    'body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;}img{max-width:100%;max-height:100vh;}';
  win.document.head.appendChild(style);

  const img = win.document.createElement('img');
  img.onload = () => {
    win.focus();
    win.print();
  };
  img.src = src;
  win.document.body.appendChild(img);
}
