import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { I18N_CONFIG, I18N_DEFAULTS, type Dictionary, type I18nLoader } from '../types/types';
import { buildI18nUrl } from '../utils/utils';

/**
 * Default loader: GET `{baseUrl}/{lang}{ext}` and `{baseUrl}/{scope}/{lang}{ext}`.
 * Goes through your HttpClient interceptors.
 * Config is read on every request, so values supplied later via `I18nService.init()` /
 * `configure()` (for example `baseUrl`) are picked up.
 */
@Injectable({ providedIn: 'root' })
export class HttpI18nLoader implements I18nLoader {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(I18N_CONFIG);

  load(lang: string, scope?: string): Observable<Dictionary> {
    const { url, baseUrl, fileExtension } = this.cfg;
    const u = url
      ? url(lang, scope)
      : buildI18nUrl(baseUrl ?? '/i18n', scope, lang, fileExtension ?? I18N_DEFAULTS.fileExtension);
    return this.http.get<Dictionary>(u);
  }
}
