import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../model/page.model';
import { CreateWordRequest, Word } from '../../model/word.model';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private readonly apiUrl = `${env.apiBaseUrl}/me/words`;
  private http = inject(HttpClient);

  /**
   * List words with optional search filter
   * Uses filter.k.field, filter.k.operator, filter.k.value format
   * @param page - Page number (0-based)
   * @param size - Number of items per page
   * @param searchTerm - Optional search query (searches in sentence field)
   * @returns Observable with paginated results
   */
  listWords(
    page: number = 0,
    size: number = 10,
    searchTerm?: string,
    sortDir?: 'asc' | 'desc',
    languageUuid?: string,
    languageToUuid?: string
  ): Observable<Page<Word>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortDir) {
      params = params.set('sort', `sentence,${sortDir}`);
    }

    if (searchTerm && searchTerm.trim()) {
      params = params
        .set('filter.k1.field', 'sentence')
        .set('filter.k1.operator', 'containsIgnoreCase')
        .set('filter.k1.value', searchTerm.trim());
    }

    if (languageUuid) {
      params = params
        .set('filter.k2.field', 'language')
        .set('filter.k2.operator', 'eq')
        .set('filter.k2.value', languageUuid);
    }

    if (languageToUuid) {
      params = params
        .set('filter.k3.field', 'languageTo')
        .set('filter.k3.operator', 'eq')
        .set('filter.k3.value', languageToUuid);
    }

    return this.http.get<Page<Word>>(this.apiUrl, { params });
  }

  addWord(word: CreateWordRequest): Observable<HttpResponse<Word>> {
    return this.http.post<Word>(
      this.apiUrl,
      word,
      { observe: 'response' } // 👈 tells Angular to return the full response
    );
  }

  getById(uuid: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiUrl}/${uuid}`);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }

  updateWord(uuid: string, word: CreateWordRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${uuid}`, word);
  }
}