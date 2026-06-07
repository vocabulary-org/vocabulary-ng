import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story, StorySummary } from './learn-deutsch-stories.model';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LearnDeutschStoriesService {
  private readonly baseUrl = `${env.apiBaseUrl}/public/deutsch/stories`;
  private readonly http = inject(HttpClient);

  getStories(): Observable<StorySummary[]> {
    return this.http.get<StorySummary[]>(this.baseUrl);
  }

  getStory(uuid: string): Observable<Story> {
    return this.http.get<Story>(`${this.baseUrl}/${uuid}`);
  }
}
