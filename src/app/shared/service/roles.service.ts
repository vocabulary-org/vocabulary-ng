import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env }  from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly apiUrl = `${env.apiBaseUrl}/public/roles`;
  

  constructor(private http: HttpClient) {}

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }
}
