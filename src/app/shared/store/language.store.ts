import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { LanguageService } from '../service/language.service';
import { Language } from '../model/language';

@Injectable({ providedIn: 'root' })
export class LanguagesStore {

  private cached$?: Observable<Language[]>;

  constructor(private languageService: LanguageService) {}

  getAll$(): Observable<Language[]> {
    if (!this.cached$) {
      this.cached$ = this.languageService.getAllLanguages().pipe(
        shareReplay(1)
      );
    }
    return this.cached$;
  }
}
