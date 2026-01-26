// src/app/shared/services/user-languages.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLanguages } from '../../model/user-languages';
import { environment as env }  from '../../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class UserLanguagesService {
   private readonly apiUrl = `${env.apiBaseUrl}/me/user-languages`;
  constructor(private http: HttpClient) {}

  createOrUpdate(body: UserLanguages): Observable<UserLanguages> {
    // adjust URL to your real endpoint
    return this.http.put<UserLanguages>( `${this.apiUrl}`, body);
  }

  get(): Observable<UserLanguages> {
    return this.http.get<UserLanguages>(`${this.apiUrl}`);
  }
}
