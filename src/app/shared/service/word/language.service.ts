// shared/service/language/language.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../../model/language';
import { environment as env }  from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${env.apiBaseUrl}/public/languages`;

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiUrl);
  }
}
