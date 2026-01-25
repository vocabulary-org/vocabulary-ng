import { Component, OnInit, signal } from '@angular/core';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { UserLanguages } from '../../shared/model/user-languages';
import { LanguagesStore } from '../../shared/store/language.store';
import { Language } from '../../shared/model/language';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-settings-user-languages',
  templateUrl: './settings-user-languages.component.html',
})
export class SettingsUserLanguagesComponent implements OnInit {
  model = signal<UserLanguages>({} as UserLanguages);

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  error = signal<string | null>(null);
  editing = signal(false);

  languages = signal<Language[]>([]);

  constructor(
    private languagesStore: LanguagesStore,
    private userLanguagesService: UserLanguagesService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    forkJoin({
      langs: this.languagesStore.getAll$(),
      userLang: this.userLanguagesService.get(),
    }).subscribe({
      next: ({ langs, userLang }) => {
        this.languages.set(langs);
        const langFrom =
          langs.find((l) => l.uuid === userLang.language?.uuid) ?? null;
        const langTo =
          langs.find((l) => l.uuid === userLang.languageTo?.uuid) ?? null;
        this.model.set({
          ...userLang,
          language: langFrom,
          languageTo: langTo,
        });
      },
      error: (err) => {
        console.error('Error loading word for edit', err);
      },
    });
  }
}
