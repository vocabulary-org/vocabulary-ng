import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NounExamplesAdminService {
  private readonly baseUrl = `${env.apiBaseUrl}/admin`;
  private readonly http = inject(HttpClient);

  generateExamples(lang: string, limit?: number): Observable<void> {
    let params = new HttpParams().set('lang', lang);
    if (limit != null) {
      params = params.set('limit', limit);
    }
    return this.http.post<void>(`${this.baseUrl}/nouns/de/examples/generate`, null, { params });
  }
}
