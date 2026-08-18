/**
 * چک می‌کنه یه فایل با pattern رشته‌ای accept (مثل input[type=file])
 * مطابقت داره یا نه. پشتیبانی می‌شه از:
 *  - MIME کامل: "image/png"
 *  - MIME با wildcard: "image/*"
 *  - پسوند فایل: ".png", ".jpg"
 *  - لیست کاما-جدا از موارد بالا: "image/*,.pdf,.docx"
 */
export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || accept.trim() === '') return true;

  const patterns = accept
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  if (!patterns.length) return true;

  const fileName = file.name.toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return fileName.endsWith(pattern);
    }
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1); // "image/"
      return fileType.startsWith(prefix);
    }
    return fileType === pattern;
  });
}

/** تبدیل بایت به یه رشته‌ی خوانا (KB/MB/GB) */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** استخراج فایل‌های واقعی از یک DataTransfer، شامل پیمایش بازگشتیِ پوشه‌ها (وقتی مرورگر پشتیبانی کنه) */
export async function extractFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const items = Array.from(dataTransfer.items || []);
  const hasEntrySupport = items.length > 0 && typeof items[0].webkitGetAsEntry === 'function';

  if (!hasEntrySupport) {
    return Array.from(dataTransfer.files || []);
  }

  const entries = items
    .map((item) => item.webkitGetAsEntry?.())
    .filter((e): e is FileSystemEntry => !!e);

  if (!entries.length) {
    return Array.from(dataTransfer.files || []);
  }

  const files: File[] = [];
  await Promise.all(entries.map((entry) => walkEntry(entry, files)));
  return files;
}

function walkEntry(entry: FileSystemEntry, out: File[]): Promise<void> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file(
        (file) => {
          out.push(file);
          resolve();
        },
        () => resolve(),
      );
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      const readAll: FileSystemEntry[] = [];
      const readBatch = () => {
        reader.readEntries(
          async (batch) => {
            if (!batch.length) {
              await Promise.all(readAll.map((e) => walkEntry(e, out)));
              resolve();
              return;
            }
            readAll.push(...batch);
            readBatch();
          },
          () => resolve(),
        );
      };
      readBatch();
    } else {
      resolve();
    }
  });
}
