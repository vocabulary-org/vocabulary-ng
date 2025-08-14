import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../model/page.model';
import { Word } from '../../model/word.model';



@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'http://localhost:9090/api/v1/vocabulary/user/word';
  private http = inject(HttpClient);

  listBooks(): Observable<Page<Word>> {
    return this.http.get<Page<Word>>(this.apiUrl);
  }
}
