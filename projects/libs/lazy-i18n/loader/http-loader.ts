import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { I18N_CONFIG, type Dictionary, type I18nLoader } from '../types/types';

/** Default loader: GET `{baseUrl}/{lang}` and `{baseUrl}/{scope}/{lang}`. Goes through your HttpClient interceptors. */
@Injectable({ providedIn: 'root' })
export class HttpI18nLoader implements I18nLoader {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(I18N_CONFIG);

  load(lang: string, scope?: string): Observable<Dictionary> {
    const { url, baseUrl = '/i18n', fileExtension = '' } = this.cfg;
    const u = url ? url(lang, scope) : `${baseUrl}/${scope ? scope + '/' : ''}${lang}${fileExtension}`;
    return this.http.get<Dictionary>(u);
  }
}
