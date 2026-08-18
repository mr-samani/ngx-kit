export type NgxDropzoneFileStatus =
  'pending' | 'accepted' | 'uploading' | 'uploaded' | 'error' | 'canceled';

export interface NgxDropzoneFile<TResponse = any> {
  /** شناسه‌ی یکتا برای track کردن توی @for و امکان حذف تکی */
  id: string;
  file: File;
  /** فقط برای فایل‌های تصویری پر می‌شه (object URL) */
  previewUrl?: string;
  status: NgxDropzoneFileStatus;
  /** Upload progress, from 0 to 100. */
  progress: number;
  /** Response returned by the upload adapter. */
  response?: TResponse;
  /** Upload error, if the request failed. */
  error?: any;
  /** در صورت رد شدن، دلیلش */
  rejectionReason?: NgxDropzoneRejectionReason;
}

export type NgxDropzoneRejectionReason = 'type' | 'size' | 'count';

export interface NgxDropzoneRejectedFile {
  file: File;
  reason: NgxDropzoneRejectionReason;
}
