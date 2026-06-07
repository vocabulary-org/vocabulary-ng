import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { DeutschLevel, Story } from '../learn-deutsch-stories/learn-deutsch-stories.model';

export type StoryLength = 'SHORT' | 'MEDIUM' | 'LONG';

export interface StoryGenerationRequest {
  level: DeutschLevel;
  topic: string;
  length: StoryLength;
}

export interface StoryFromTextRequest {
  text: string;
  title?: string;
  topic?: string;
  level?: DeutschLevel;
}

@Injectable({ providedIn: 'root' })
export class StoryDeAdminService {
  private readonly baseUrl = `${env.apiBaseUrl}/admin/deutsch/stories`;
  private readonly http = inject(HttpClient);

  generate(request: StoryGenerationRequest): Observable<Story> {
    return this.http.post<Story>(`${this.baseUrl}/generate`, request);
  }

  generateFromText(request: StoryFromTextRequest): Observable<Story> {
    return this.http.post<Story>(`${this.baseUrl}/from-text`, request);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
