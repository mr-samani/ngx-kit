import { describe, expect, it } from 'vitest';
import { formatBytes, matchesAccept } from '../utils/file-matching';

function makeFile(name: string, type: string): File {
  return new File(['content'], name, { type });
}

describe('matchesAccept', () => {
  it('بدون accept باید همیشه true برگردونه', () => {
    expect(matchesAccept(makeFile('a.png', 'image/png'), undefined)).toBe(true);
    expect(matchesAccept(makeFile('a.png', 'image/png'), '')).toBe(true);
    expect(matchesAccept(makeFile('a.png', 'image/png'), '   ')).toBe(true);
  });

  it('باید با MIME کامل مطابقت بده', () => {
    expect(matchesAccept(makeFile('a.png', 'image/png'), 'image/png')).toBe(true);
    expect(matchesAccept(makeFile('a.pdf', 'application/pdf'), 'image/png')).toBe(false);
  });

  it('باید با MIME-wildcard مطابقت بده (مثل image/*)', () => {
    expect(matchesAccept(makeFile('a.jpg', 'image/jpeg'), 'image/*')).toBe(true);
    expect(matchesAccept(makeFile('a.mp4', 'video/mp4'), 'image/*')).toBe(false);
  });

  it('باید با پسوندِ فایل مطابقت بده، مستقل از حروف بزرگ/کوچیک', () => {
    expect(matchesAccept(makeFile('report.PDF', 'application/pdf'), '.pdf')).toBe(true);
    expect(matchesAccept(makeFile('report.pdf', ''), '.PDF')).toBe(true);
    expect(matchesAccept(makeFile('report.docx', ''), '.pdf')).toBe(false);
  });

  it('باید لیستِ کاما-جدا رو با OR چک کنه', () => {
    const accept = 'image/*,.pdf,.docx';
    expect(matchesAccept(makeFile('a.jpg', 'image/jpeg'), accept)).toBe(true);
    expect(matchesAccept(makeFile('a.pdf', 'application/pdf'), accept)).toBe(true);
    expect(matchesAccept(makeFile('a.docx', ''), accept)).toBe(true);
    expect(matchesAccept(makeFile('a.zip', 'application/zip'), accept)).toBe(false);
  });
});

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [500, '500 B'],
    [1024, '1.0 KB'],
    [1536, '1.5 KB'],
    [5 * 1024 * 1024, '5.0 MB'],
    [2.5 * 1024 * 1024 * 1024, '2.5 GB'],
  ])('formatBytes(%i) === %s', (input, expected) => {
    expect(formatBytes(input)).toBe(expected);
  });
});
