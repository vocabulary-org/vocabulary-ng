// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:9090/api/v1/vocabulary/public/users';

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(
      `${this.apiUrl}`,
      user,
      { observe: 'response' } // 👈 tells Angular to return the full response
    );
  }
}
