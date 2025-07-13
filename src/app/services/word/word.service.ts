import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../../model/word/word.model';
// Add import for Page type
import { Page } from '../../model/common/page.model';



@Injectable({
  providedIn: 'root'
})
export class WordService {
  //fix this, inject it
  private readonly apiUrl = 'http://localhost:9090/api/v1/vocabulary/word';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Page<Word>> {
    const params = new HttpParams()
      .set('page', 0)
      .set('size', 20);

    return this.http.get<Page<Word>>(this.apiUrl, { params });
  }
}
