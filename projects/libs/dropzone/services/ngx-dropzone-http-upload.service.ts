import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
  type HttpUploadProgressEvent,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import {
  NgxDropzoneUploadEvent,
  NgxDropzoneUploadRequest,
  NgxDropzoneUploadService,
} from '../contracts/dropzone-upload';

@Injectable({ providedIn: 'root' })
export class NgxDropzoneHttpUploadService implements NgxDropzoneUploadService {
  private readonly http = inject(HttpClient);

  upload<TResponse = unknown>(
    request: NgxDropzoneUploadRequest,
  ): Observable<NgxDropzoneUploadEvent<TResponse>> {
    const body = new FormData();
    body.append(request.alias, request.file, request.file.name);

    for (const [key, value] of Object.entries(request.data ?? {})) {
      body.append(key, value instanceof Blob ? value : String(value));
    }

    const headers =
      request.headers instanceof HttpHeaders ? request.headers : new HttpHeaders(request.headers);

    return this.http
      .post<TResponse>(request.url, body, {
        headers,
        withCredentials: request.withCredentials ?? false,
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event): event is HttpUploadProgressEvent | HttpResponse<TResponse> =>
            event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response,
        ),
        map((event): NgxDropzoneUploadEvent<TResponse> => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total;

            return {
              type: 'progress',
              loaded: event.loaded,
              total,
              percent: total ? Math.min(100, Math.round((event.loaded / total) * 100)) : 0,
            };
          }

          return {
            type: 'response',
            response: event.body as TResponse,
            status: event.status,
            headers: event.headers,
          };
        }),
      );
  }
}
