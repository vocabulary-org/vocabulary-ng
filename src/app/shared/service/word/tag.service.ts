import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { TagSuggestion } from '../../model/word.model';

export interface TagSuggestRequest {
  sentence: string;
  languageCode: string;
}

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${env.apiBaseUrl}/me/tags/suggest`;

  suggest(request: TagSuggestRequest): Observable<TagSuggestion[]> {
    return this.http.post<TagSuggestion[]>(this.apiUrl, request);
  }
}
