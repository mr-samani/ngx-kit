import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, type Observable } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxDropzoneComponent } from '../components/dropzone.component';
import {
  NgxDropzoneUploadEvent,
  NgxDropzoneUploadRequest,
  NgxDropzoneUploadService,
} from '../contracts/dropzone-upload';
import { NGX_DROPZONE_UPLOAD_SERVICE } from '../services/ngx-dropzone-upload.token';

class FakeUploadService implements NgxDropzoneUploadService {
  readonly requests: NgxDropzoneUploadRequest[] = [];
  readonly subjects = new Map<string, Subject<NgxDropzoneUploadEvent>>();

  upload<TResponse = unknown>(
    request: NgxDropzoneUploadRequest,
  ): Observable<NgxDropzoneUploadEvent<TResponse>> {
    this.requests.push(request);
    const subject = new Subject<NgxDropzoneUploadEvent>();
    this.subjects.set(request.file.name, subject);
    return subject.asObservable() as Observable<NgxDropzoneUploadEvent<TResponse>>;
  }
}

describe('NgxDropzoneComponent upload flow', () => {
  let fixture: ComponentFixture<NgxDropzoneComponent>;
  let service: FakeUploadService;

  beforeEach(async () => {
    service = new FakeUploadService();

    await TestBed.configureTestingModule({
      imports: [NgxDropzoneComponent],
      providers: [
        {
          provide: NGX_DROPZONE_UPLOAD_SERVICE,
          useValue: service,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxDropzoneComponent);
    fixture.componentRef.setInput('uploadUrl', '/api/files');
    fixture.componentRef.setInput('uploadAlias', 'files');
    fixture.componentRef.setInput('maxParallel', 2);
    fixture.detectChanges();
  });

  function selectFiles(...files: File[]) {
    const input = fixture.nativeElement.querySelector('input[type=file]') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: files,
    });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function items(): any[] {
    return (fixture.componentInstance as any).files();
  }

  it('auto-uploads newly selected files', () => {
    fixture.componentRef.setInput('autoUpload', true);
    fixture.detectChanges();

    selectFiles(
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
    );

    expect(service.requests).toHaveLength(2);
    expect(items().every((item) => item.status === 'uploading')).toBe(true);
  });

  it('respects maxParallel and starts queued files when a slot is released', () => {
    fixture.componentRef.setInput('autoUpload', true);
    fixture.componentRef.setInput('maxParallel', 1);
    fixture.detectChanges();

    selectFiles(new File(['a'], 'a.txt'), new File(['b'], 'b.txt'));

    expect(service.requests.map((request) => request.file.name)).toEqual(['a.txt']);

    service.subjects.get('a.txt')!.next({
      type: 'progress',
      loaded: 50,
      total: 100,
      percent: 50,
    });

    expect(items().find((item) => item.file.name === 'a.txt').progress).toBe(50);

    service.subjects.get('a.txt')!.next({
      type: 'response',
      response: { id: 1 },
      status: 200,
    });
    service.subjects.get('a.txt')!.complete();

    expect(service.requests.map((request) => request.file.name)).toEqual(['a.txt', 'b.txt']);
    expect(items().find((item) => item.file.name === 'a.txt').status).toBe('uploaded');
  });

  it('supports manual upload-all mode', () => {
    fixture.componentRef.setInput('uploadMode', 'all');
    fixture.detectChanges();

    selectFiles(new File(['a'], 'a.txt'), new File(['b'], 'b.txt'));

    expect(service.requests).toHaveLength(0);

    const button = fixture.nativeElement.querySelector(
      '.ngx-dropzone-upload-all',
    ) as HTMLButtonElement;
    expect(button).not.toBeNull();
    button.click();
    fixture.detectChanges();

    expect(service.requests).toHaveLength(2);
  });

  it('supports manual per-file uploads', () => {
    fixture.componentRef.setInput('uploadMode', 'single');
    fixture.detectChanges();

    selectFiles(new File(['a'], 'a.txt'));

    expect(service.requests).toHaveLength(0);

    const button = fixture.nativeElement.querySelector('.ngx-dropzone-upload') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(service.requests).toHaveLength(1);
    expect(service.requests[0].alias).toBe('files');
  });

  it('marks failed uploads as error and exposes retry', () => {
    fixture.componentRef.setInput('autoUpload', true);
    fixture.detectChanges();

    selectFiles(new File(['a'], 'a.txt'));

    service.subjects.get('a.txt')!.error(new Error('network'));

    expect(items()[0].status).toBe('error');
    expect(fixture.nativeElement.querySelector('.ngx-dropzone-retry')).not.toBeNull();
  });
});
