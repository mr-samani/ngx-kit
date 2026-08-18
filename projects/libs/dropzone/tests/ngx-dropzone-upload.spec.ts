import { HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, afterEach } from 'vitest';
import { NgxDropzoneHttpUploadService } from '../services/ngx-dropzone-http-upload.service';

describe('NgxDropzoneHttpUploadService', () => {
  let service: NgxDropzoneHttpUploadService;
  let http: HttpTestingController;

  afterEach(() => {
    http.verify();
  });

  it('uploads the file under the configured alias and emits progress/response', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), NgxDropzoneHttpUploadService],
    });

    service = TestBed.inject(NgxDropzoneHttpUploadService);
    http = TestBed.inject(HttpTestingController);

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const events: unknown[] = [];

    service
      .upload({
        url: '/api/upload',
        alias: 'document',
        file,
        data: { tenantId: 42, public: true },
      })
      .subscribe((event) => events.push(event));

    const request = http.expectOne('/api/upload');
    expect(request.request.method).toBe('POST');

    const body = request.request.body as FormData;
    expect(body.get('document')).toBe(file);
    expect(body.get('tenantId')).toBe('42');
    expect(body.get('public')).toBe('true');

    request.event({
      type: HttpEventType.UploadProgress,
      loaded: 50,
      total: 100,
    });
    request.flush({ id: 10 });

    expect(events).toEqual([
      {
        type: 'progress',
        loaded: 50,
        total: 100,
        percent: 50,
      },
      expect.objectContaining({
        type: 'response',
        response: { id: 10 },
        status: 200,
      }),
    ]);
  });
});
