import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../model/page.model';
import { CreateWordRequest, Word } from '../../model/word.model';
import { environment as env }  from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private readonly apiUrl = `${env.apiBaseUrl}/me/words`;
  private http = inject(HttpClient);

  listWords(): Observable<Page<Word>> {
    return this.http.get<Page<Word>>(this.apiUrl);
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
}
