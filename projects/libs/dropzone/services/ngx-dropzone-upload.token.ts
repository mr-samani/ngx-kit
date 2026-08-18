import { InjectionToken, inject } from '@angular/core';
import { NgxDropzoneHttpUploadService } from './ngx-dropzone-http-upload.service';
import { NgxDropzoneUploadService } from '../contracts/dropzone-upload';

/**
 * Upload adapter used by ngx-dropzone.
 *
 * Default: Angular HttpClient.
 * Override this token at application/component level to use Axios or any
 * other upload implementation.
 */
export const NGX_DROPZONE_UPLOAD_SERVICE = new InjectionToken<NgxDropzoneUploadService>(
  'NGX_DROPZONE_UPLOAD_SERVICE',
  {
    providedIn: 'root',
    factory: () => inject(NgxDropzoneHttpUploadService),
  },
);
