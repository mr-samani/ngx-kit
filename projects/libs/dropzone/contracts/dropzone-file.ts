export interface NgxDropzoneFile {
  /** شناسه‌ی یکتا برای track کردن توی @for و امکان حذف تکی */
  id: string;
  file: File;
  /** فقط برای فایل‌های تصویری پر می‌شه (object URL) */
  previewUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  /** در صورت رد شدن، دلیلش */
  rejectionReason?: NgxDropzoneRejectionReason;
}

export type NgxDropzoneRejectionReason = 'type' | 'size' | 'count';

export interface NgxDropzoneRejectedFile {
  file: File;
  reason: NgxDropzoneRejectionReason;
}
