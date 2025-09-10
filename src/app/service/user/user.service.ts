// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/api/v1/vocabulary/me/words';

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user`, user);
  }
}
