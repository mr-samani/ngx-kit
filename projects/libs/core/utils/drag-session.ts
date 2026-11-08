/**
 * تمام کامپوننت‌های قابل‌درگ کتابخانه (saturation، slider، range-slider،
 * box-shadow) قبلاً یک الگوی تکراری داشتن:
 *
 *   @HostListener('doc:mousemove', ['$event'])
 *   @HostListener('doc:touchmove', ['$event'])
 *   onDrag(ev) { if (!this.isDragging) return; ... }
 *
 * مشکل: این listenerها برای کل عمر کامپوننت روی `doc` باقی می‌مونن —
 * حتی وقتی اصلاً دراگی در حال انجام نیست. یعنی روی صفحه‌ای با چند تا
 * color-picker/slider، هر حرکت موس/انگشت روی کل صفحه (نه فقط روی خودِ
 * اسلایدر) باعث اجرای N تابع (به تعداد اینستنس‌ها) می‌شه که هرکدوم هم چرخه‌ی
 * زون انگیولار رو تریگر می‌کنن — یک مشکل واقعی پرفورمنس، مخصوصاً در صفحاتی
 * با چند نمونه هم‌زمان یا حرکت زیاد موس.
 *
 * این تابع جایگزین اون الگو می‌شه: listenerها فقط در طول یک دراگِ واقعی
 * (بین mousedown/touchstart تا mouseup/touchend) روی doc اضافه می‌شن و
 * بلافاصله بعدش پاک می‌شن.
 *
 * یه فایده‌ی جانبیِ مهم دیگه هم داره: روی touchmove مقدار `{ passive: false }`
 * ست می‌شه و preventDefault صدا زده می‌شه، پس در حین درگ کردنِ thumb روی
 * موبایل، صفحه اسکرول نمی‌خوره (باگی که با @HostListener قبلی وجود داشت،
 * چون هیچ‌جا preventDefault روی touchmove صدا زده نمی‌شد).
 */
export interface DragSessionCallbacks {
  doc: Document;
  onMove: (ev: MouseEvent | TouchEvent) => void;
  onEnd?: (ev: MouseEvent | TouchEvent) => void;
}

/** با فراخوانی این تابع (مثلاً داخل dragStart) یک نشست‌ درگ شروع می‌شه. */
export function startDragSession({ doc, onMove, onEnd }: DragSessionCallbacks): () => void {
  const handleMove = (ev: MouseEvent | TouchEvent) => {
    if (ev.type === 'touchmove') {
      // جلوگیری از اسکرول شدن صفحه هم‌زمان با درگ کردن روی موبایل/تاچ
      ev.preventDefault();
    }
    onMove(ev);
  };

  const handleEnd = (ev: MouseEvent | TouchEvent) => {
    stop();
    onEnd?.(ev);
  };

  const stop = (): void => {
    doc.removeEventListener('mousemove', handleMove);
    doc.removeEventListener('touchmove', handleMove);
    doc.removeEventListener('mouseup', handleEnd);
    doc.removeEventListener('touchend', handleEnd);
    doc.removeEventListener('touchcancel', handleEnd);
  };

  doc.addEventListener('mousemove', handleMove);
  doc.addEventListener('touchmove', handleMove, { passive: false });
  doc.addEventListener('mouseup', handleEnd);
  doc.addEventListener('touchend', handleEnd);
  doc.addEventListener('touchcancel', handleEnd);

  // تابع stop برگردونده می‌شه تا هم بشه دستی صداش زد (مثلاً در ngOnDestroy،
  // اگه کامپوننت درست وسط یه درگ نابود بشه) و هم به‌صورت خودکار روی
  // mouseup/touchend صدا زده می‌شه.
  return stop;
}
