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
  listWords(page: number = 0, size: number = 10, searchTerm?: string): Observable<Page<Word>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Add search filter if provided
    // Searches in sentence field using containsIgnoreCase
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.trim();
      
      // Search in sentence field
      params = params
        .set('filter.k.field', 'sentence')
        .set('filter.k.operator', 'containsIgnoreCase')
        .set('filter.k.value', term);
    }

    return this.http.get<Page<Word>>(this.apiUrl, { params });
  }

  /**
   * Search for words by sentence, translation, or description
   * This is a convenience method that calls listWords with search filter
   * @param searchTerm - The search query
   * @param page - Page number (0-based)
   * @param size - Number of items per page
   * @returns Observable with paginated search results
   */
  search(searchTerm: string, page: number = 0, size: number = 10): Observable<Page<Word>> {
    return this.listWords(page, size, searchTerm);
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