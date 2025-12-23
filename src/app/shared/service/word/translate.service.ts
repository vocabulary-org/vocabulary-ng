// shared/service/language/language.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../../model/language';
import { environment as env }  from '../../../../environments/environment';
import { TranslateRequest } from '../../model/translate-request.model';
import { TranslateResponse } from '../../model/translate-response.model';


@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${env.apiBaseUrl}/me/translate`;

translate(request: TranslateRequest): Observable<TranslateResponse> {
    return this.http.post<TranslateResponse>(this.apiUrl, request);
  }
}
