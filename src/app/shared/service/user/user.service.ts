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

  createUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(
      `${this.apiUrl}`,
      user,
      { observe: 'response' } // 👈 tells Angular to return the full response
    );
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.apiDeleteUrl}`);
  }
}
