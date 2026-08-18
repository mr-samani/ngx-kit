import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import {
  NgxDropzoneFile,
  NgxDropzoneRejectedFile,
  NgxDropzoneRejectionReason,
} from '../contracts/dropzone-file';
import {
  NgxDropzoneUploadProgressEvent,
  NgxDropzoneUploadService,
} from '../contracts/dropzone-upload';
import { NGX_DROPZONE_UPLOAD_SERVICE } from '../services/ngx-dropzone-upload.token';
import { extractFilesFromDataTransfer, formatBytes, matchesAccept } from '../utils/file-matching';

let uidCounter = 0;
function nextId(): string {
  return `ngx-dz-${Date.now().toString(36)}-${uidCounter++}`;
}

export type NgxDropzoneUploadMode = 'all' | 'single';

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

  /** Upload endpoint. */
  uploadUrl = input<string>('');
  /** Multipart form-data field name. */
  uploadAlias = input<string>('file');
  /** Automatically enqueue newly accepted files for upload. */
  autoUpload = input<boolean>(false);
  /** Maximum number of simultaneous uploads. */
  maxParallel = input<number>(3);
  /**
   * Manual upload behavior:
   * - all: one "Upload all" action uploads all pending files.
   * - single: every pending row gets its own Upload button.
   */
  uploadMode = input<NgxDropzoneUploadMode>('all');
  /** Extra multipart form fields sent with every file. */
  uploadData = input<Record<string, string | Blob | number | boolean>>({});
  /** Optional request headers. */
  uploadHeaders = input<Record<string, string | string[]>>({});
  /** Send credentials/cookies with the upload request. */
  uploadWithCredentials = input<boolean>(false);

  filesAdded = output<File[]>();
  filesRejected = output<NgxDropzoneRejectedFile[]>();
  filesChange = output<File[]>();

  /** Emitted when an individual upload starts. */
  uploadStarted = output<NgxDropzoneFile>();
  /** Emitted for every upload progress update. */
  uploadProgress = output<NgxDropzoneUploadProgressEvent>();
  /** Emitted after a file is successfully uploaded. */
  uploadSuccess = output<NgxDropzoneFile>();
  /** Emitted when an upload fails. */
  uploadError = output<{ item: NgxDropzoneFile; error: unknown }>();

  protected readonly files = signal<NgxDropzoneFile[]>([]);
  protected readonly isDragging = signal(false);
  private dragCounter = 0;

  private readonly uploadService = inject<NgxDropzoneUploadService>(NGX_DROPZONE_UPLOAD_SERVICE);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private readonly uploadSubscriptions = new Map<string, Subscription>();
  private readonly uploadQueue: string[] = [];
  private activeUploads = 0;
  private readonly activeUploadIds = new Set<string>();

  protected readonly pendingCount = computed(
    () => this.files().filter((item) => this.isPending(item)).length,
  );

  protected readonly hasUploadConfiguration = computed(() => this.uploadUrl().trim().length > 0);

  protected readonly hint = computed(() => {
    const parts: string[] = [];
    const accept = this.accept();
    if (accept) parts.push(accept);
    const max = this.maxFileSize();
    if (max) parts.push(`max ${formatBytes(max)}`);
    return parts.join(' · ');
  });

  protected formatSize(bytes: number): string {
    return formatBytes(bytes);
  }

  protected isPending(item: NgxDropzoneFile): boolean {
    return item.status === 'pending' || item.status === 'accepted';
  }

  protected trackById(_index: number, item: NgxDropzoneFile): string {
    return item.id;
  }

  ngOnDestroy(): void {
    for (const subscription of this.uploadSubscriptions.values()) {
      subscription.unsubscribe();
    }
    this.uploadSubscriptions.clear();

    for (const item of this.files()) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
  }

  protected onDragEnter(ev: DragEvent): void {
    ev.preventDefault();
    if (this.disabled()) return;
    this.dragCounter++;
    this.isDragging.set(true);
  }

  protected onDragOver(ev: DragEvent): void {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
    }
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
    input.value = '';
  }

  protected removeFile(id: string): void {
    const target = this.files().find((f) => f.id === id);
    this.uploadSubscriptions.get(id)?.unsubscribe();
    this.uploadSubscriptions.delete(id);

    // Unsubscribing an HttpClient upload cancels the request. Release its
    // concurrency slot immediately; finalize() will see that the id is no
    // longer active and won't decrement twice.
    if (this.activeUploadIds.delete(id)) {
      this.activeUploads = Math.max(0, this.activeUploads - 1);
    }

    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);

    this.files.update((list) => list.filter((f) => f.id !== id));

    // Remove stale queue entries. The queue is intentionally lazy, so an
    // entry can safely remain until pumpQueue() sees that it no longer exists.
    this.emitCurrentFiles();
    this.pumpQueue();
  }

  protected uploadAll(): void {
    this.enqueueUploads(
      this.files()
        .filter((item) => this.isPending(item))
        .map((item) => item.id),
    );
  }

  protected uploadSingle(id: string): void {
    this.enqueueUploads([id]);
  }

  protected retryUpload(id: string): void {
    this.files.update((list) =>
      list.map((item) =>
        item.id === id ? { ...item, status: 'pending', progress: 0, error: undefined } : item,
      ),
    );
    this.enqueueUploads([id]);
  }

  private handleIncomingFiles(incoming: File[]): void {
    if (!incoming.length) return;

    const accepted: NgxDropzoneFile[] = [];
    const rejected: NgxDropzoneRejectedFile[] = [];

    // A single-file dropzone behaves like a native single-select input:
    // selecting another file replaces the previous one.
    const existingCount = this.multiple() ? this.files().length : 0;
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
        progress: 0,
      });
    }

    if (accepted.length) {
      if (!isMultiple) {
        for (const previous of this.files()) {
          this.uploadSubscriptions.get(previous.id)?.unsubscribe();
          this.uploadSubscriptions.delete(previous.id);
          this.activeUploadIds.delete(previous.id);
          if (previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        }
        this.activeUploads = this.activeUploadIds.size;
      }

      this.files.update((list) => (isMultiple ? [...list, ...accepted] : accepted));
      this.filesAdded.emit(accepted.map((a) => a.file));
      this.emitCurrentFiles();

      if (this.autoUpload()) {
        this.enqueueUploads(accepted.map((item) => item.id));
      }
    }

    if (rejected.length) {
      this.filesRejected.emit(rejected);
    }
  }

  private enqueueUploads(ids: string[]): void {
    if (!this.uploadUrl().trim()) {
      const error = new Error('ngx-dropzone: uploadUrl is required for uploading files.');
      for (const id of ids) this.markUploadError(id, error, false);
      return;
    }

    const queued = new Set(this.uploadQueue);
    for (const id of ids) {
      const item = this.files().find((file) => file.id === id);
      if (!item || !this.isPending(item) || queued.has(id)) continue;
      this.uploadQueue.push(id);
      queued.add(id);
    }

    this.pumpQueue();
  }

  private pumpQueue(): void {
    const limit = Math.max(1, Math.floor(this.maxParallel() || 1));

    while (this.activeUploads < limit && this.uploadQueue.length) {
      const id = this.uploadQueue.shift()!;
      const item = this.files().find((file) => file.id === id);

      if (!item || !this.isPending(item)) continue;

      this.startUpload(item);
    }
  }

  private startUpload(item: NgxDropzoneFile): void {
    this.activeUploads++;
    this.activeUploadIds.add(item.id);

    this.updateFile(item.id, {
      status: 'uploading',
      progress: 0,
      error: undefined,
    });

    const current = this.files().find((file) => file.id === item.id);
    if (current) this.uploadStarted.emit(current);

    let subscription: Subscription;

    try {
      subscription = this.uploadService
        .upload({
          url: this.uploadUrl(),
          alias: this.uploadAlias() || 'file',
          file: item.file,
          data: this.uploadData(),
          headers: this.uploadHeaders(),
          withCredentials: this.uploadWithCredentials(),
        })
        .pipe(finalize(() => this.finishUpload(item.id)))
        .subscribe({
          next: (event) => {
            if (event.type === 'progress') {
              this.updateFile(item.id, {
                progress: event.percent,
              });

              const updated = this.files().find((file) => file.id === item.id);
              if (updated) {
                this.uploadProgress.emit({
                  item: updated,
                  loaded: event.loaded,
                  total: event.total,
                  percent: event.percent,
                });
              }
              return;
            }

            this.updateFile(item.id, {
              status: 'uploaded',
              progress: 100,
              response: event.response,
              error: undefined,
            });

            const updated = this.files().find((file) => file.id === item.id);
            if (updated) this.uploadSuccess.emit(updated);
          },
          error: (error) => {
            this.markUploadError(item.id, error, true);
          },
        });
    } catch (error) {
      this.markUploadError(item.id, error, true);
      this.finishUpload(item.id);
      return;
    }

    if (!subscription.closed) this.uploadSubscriptions.set(item.id, subscription);
  }

  private markUploadError(id: string, error: unknown, releaseActiveSlot: boolean): void {
    this.updateFile(id, {
      status: 'error',
      error,
    });

    const item = this.files().find((file) => file.id === id);
    if (item) this.uploadError.emit({ item, error });

    if (!releaseActiveSlot) {
      this.pumpQueue();
    }
  }

  private finishUpload(id: string): void {
    this.uploadSubscriptions.delete(id);

    if (this.activeUploadIds.delete(id)) {
      this.activeUploads = Math.max(0, this.activeUploads - 1);
    }

    this.pumpQueue();
  }

  private updateFile(id: string, patch: Partial<NgxDropzoneFile>): void {
    this.files.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  private emitCurrentFiles(): void {
    this.filesChange.emit(this.files().map((f) => f.file));
  }
}
