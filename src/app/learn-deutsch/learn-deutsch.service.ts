import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeutschNoun } from './learn-deutsch.model';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LearnDeutschService {
  private readonly baseUrl = `${env.apiBaseUrl}/public`;
  private readonly http = inject(HttpClient);

  getNouns(limit = 100, lang = 'en'): Observable<DeutschNoun[]> {
    const params = new HttpParams().set('limit', limit).set('lang', lang);
    return this.http.get<DeutschNoun[]>(`${this.baseUrl}/deutsch/nouns`, { params });
  }
}
