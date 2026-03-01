// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model';
import { environment as env }  from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl = `${env.apiBaseUrl}/public/users`;
  private readonly apiDeleteUrl = `${env.apiBaseUrl}/me/users`;

  constructor(private http: HttpClient) {}

  createUser(user: User, turnstileToken?: string): Observable<HttpResponse<User>> {
    const headers: Record<string, string> = {};
    if (turnstileToken) {
      headers['CF-Turnstile-Response'] = turnstileToken;
    }
    return this.http.post<User>(
      `${this.apiUrl}`,
      user,
      { observe: 'response', headers }
    );
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.apiDeleteUrl}`);
  }
}
