import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  NgxDropzoneFile,
  NgxDropzoneRejectedFile,
  NgxDropzoneRejectionReason,
} from '../contracts/dropzone-file';
import { extractFilesFromDataTransfer, formatBytes, matchesAccept } from '../utils/file-matching';

let uidCounter = 0;
function nextId(): string {
  return `ngx-dz-${Date.now().toString(36)}-${uidCounter++}`;
}

/**
 * ناحیه‌ی درگ‌اند‌دراپِ فایل — کاملاً مستقل (بدون وابستگی به هیچ lib
 * دیگه‌ای، حتی shared)، signal-based و OnPush.
 *
 * ویژگی‌های مهمی که معمولاً پیاده‌سازی‌های ساده‌ی dropzone ندارن:
 *  - شمارنده‌ی dragenter/dragleave: چون dragleave برای فرزندهای داخل
 *    dropzone هم شلیک می‌شه، پیاده‌سازی‌های ساده موقع درگ‌کردن روی متن/آیکون
 *    داخل ناحیه، حالت "درگ" رو اشتباهی خاموش می‌کنن (چشمک‌زدن). این‌جا با
 *    شمارنده حل شده.
 *  - پیمایش بازگشتیِ پوشه‌ها (وقتی کاربر یه پوشه رو درگ کنه، نه فقط فایل).
 *  - قابل‌دسترسی با کیبورد (focusable + Enter/Space).
 *  - پاک‌سازی object URL پیش‌نمایش‌ها روی حذف/destroy (وگرنه نشتی حافظه‌ست).
 */
@Component({
  selector: 'ngx-dropzone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  host: {
    class: 'ngx-dropzone-host',
  },
})
export class NgxDropzoneComponent implements OnDestroy {
  /** الگوی accept مثل input[type=file]: "image/*", ".pdf,.docx" و ... */
  accept = input<string>('');
  multiple = input<boolean>(true);
  /** حداکثر حجم هر فایل به بایت؛ undefined یعنی بدون محدودیت */
  maxFileSize = input<number | undefined>(undefined);
  /** حداکثر تعداد فایل مجاز؛ undefined یعنی بدون محدودیت */
  maxFiles = input<number | undefined>(undefined);
  disabled = input<boolean>(false);
  /** نمایش لیست/پیش‌نمایش فایل‌های انتخاب‌شده داخل خودِ کامپوننت */
  showFileList = input<boolean>(true);

  filesAdded = output<File[]>();
  filesRejected = output<NgxDropzoneRejectedFile[]>();
  /** کل لیست فعلی (بعد از هر تغییر) — برای binding راحت‌تر */
  filesChange = output<File[]>();

  protected readonly files = signal<NgxDropzoneFile[]>([]);
  protected readonly isDragging = signal(false);
  private dragCounter = 0;

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly hint = computed(() => {
    const parts: string[] = [];
    const accept = this.accept();
    if (accept) parts.push(accept);
    const max = this.maxFileSize();
    if (max) parts.push(`حداکثر ${formatBytes(max)}`);
    return parts.join(' · ');
  });

  ngOnDestroy(): void {
    // همه‌ی object URLهای پیش‌نمایش باید revoke بشن، وگرنه تا وقتی تب باز
    // باشه، بلاب‌های تصویر توی حافظه‌ی مرورگر می‌مونن.
    for (const f of this.files()) {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    }
  }

  protected onDragEnter(ev: DragEvent): void {
    ev.preventDefault();
    if (this.disabled()) return;
    this.dragCounter++;
    this.isDragging.set(true);
  }

  protected onDragOver(ev: DragEvent): void {
    // بدون preventDefault روی dragover، رویداد drop اصلاً شلیک نمی‌شه.
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
  }

  protected onDragLeave(ev: DragEvent): void {
    ev.preventDefault();
    if (this.disabled()) return;
    this.dragCounter = Math.max(0, this.dragCounter - 1);
    if (this.dragCounter === 0) this.isDragging.set(false);
  }

  protected async onDrop(ev: DragEvent): Promise<void> {
    ev.preventDefault();
    this.dragCounter = 0;
    this.isDragging.set(false);
    if (this.disabled() || !ev.dataTransfer) return;

    const files = await extractFilesFromDataTransfer(ev.dataTransfer);
    this.handleIncomingFiles(files);
  }

  protected onBrowseClick(): void {
    if (this.disabled()) return;
    this.fileInput()?.nativeElement.click();
  }

  protected onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.onBrowseClick();
    }
  }

  protected onFileInputChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.handleIncomingFiles(files);
    // اجازه بده همون فایل دوباره انتخاب بشه (input تغییر نمی‌کنه وگرنه)
    input.value = '';
  }

  protected removeFile(id: string): void {
    const target = this.files().find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    this.files.update((list) => list.filter((f) => f.id !== id));
    this.emitCurrentFiles();
  }

  private handleIncomingFiles(incoming: File[]): void {
    if (!incoming.length) return;

    const accepted: NgxDropzoneFile[] = [];
    const rejected: NgxDropzoneRejectedFile[] = [];

    const existingCount = this.files().filter((f) => f.status === 'accepted').length;
    const maxFiles = this.maxFiles();
    const maxSize = this.maxFileSize();
    const isMultiple = this.multiple();

    const pool = isMultiple ? incoming : incoming.slice(0, 1);

    for (const file of pool) {
      let reason: NgxDropzoneRejectionReason | undefined;
      if (!matchesAccept(file, this.accept())) {
        reason = 'type';
      } else if (maxSize != null && file.size > maxSize) {
        reason = 'size';
      } else if (maxFiles != null && existingCount + accepted.length >= maxFiles) {
        reason = 'count';
      }

      if (reason) {
        rejected.push({ file, reason });
        continue;
      }

      const isImage = file.type.startsWith('image/');
      accepted.push({
        id: nextId(),
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
        status: 'accepted',
      });
    }

    if (accepted.length) {
      this.files.update((list) => (isMultiple ? [...list, ...accepted] : accepted));
      this.filesAdded.emit(accepted.map((a) => a.file));
      this.emitCurrentFiles();
    }
    if (rejected.length) {
      this.filesRejected.emit(rejected);
    }
  }

  private emitCurrentFiles(): void {
    this.filesChange.emit(this.files().map((f) => f.file));
  }
}
