import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NgxDropzoneUploadRequest {
  /** Target endpoint. */
  url: string;
  /** Multipart form field name used for the file. */
  alias: string;
  file: File;
  /** Optional additional multipart fields. */
  data?: Record<string, string | Blob | number | boolean>;
  /** Optional request headers. */
  headers?: HttpHeaders | Record<string, string | string[]>;
  /** Send cookies/auth information for cross-origin requests. */
  withCredentials?: boolean;
}

export type NgxDropzoneUploadEvent<TResponse = unknown> =
  | {
      type: 'progress';
      loaded: number;
      total?: number;
      percent: number;
    }
  | {
      type: 'response';
      response: TResponse;
      status: number;
      headers?: HttpHeaders;
    };

/**
 * Upload adapter used by ngx-dropzone.
 *
 * Implement this interface when the default HttpClient implementation is not
 * suitable (for example, when the host application uses Axios, fetch, tus,
 * S3 multipart upload, etc.).
 */
export interface NgxDropzoneUploadService {
  upload<TResponse = unknown>(
    request: NgxDropzoneUploadRequest,
  ): Observable<NgxDropzoneUploadEvent<TResponse>>;
}

export interface NgxDropzoneUploadProgressEvent {
  item: NgxDropzoneFileLike;
  loaded: number;
  total?: number;
  percent: number;
}

/**
 * Deliberately small structural type so consumers do not have to depend on a
 * concrete response type.
 */
export interface NgxDropzoneFileLike {
  id: string;
  file: File;
  progress: number;
}
