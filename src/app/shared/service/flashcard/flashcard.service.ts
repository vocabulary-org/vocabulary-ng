import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { WordView, WordLearning, WordReviewResult, WordReviewResultType } from '../../model/flashcard.model';

@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private readonly apiUrl = `${env.apiBaseUrl}/me/flashcards`;

  constructor(private http: HttpClient) {}

  getWordsForReview(languageUuid: string, languageToUuid: string, limit: number = 10): Observable<WordView[]> {
    const params = new HttpParams()
      .set('language', languageUuid)
      .set('languageTo', languageToUuid)
      .set('limit', limit.toString());
    return this.http.get<WordView[]>(`${this.apiUrl}/words`, { params });
  }

  review(wordUuid: string, wordReviewResultType: WordReviewResultType): Observable<WordLearning> {
    const body: WordReviewResult = { wordUuid, wordReviewResultType };
    return this.http.post<WordLearning>(`${this.apiUrl}/review`, body);
  }
}
