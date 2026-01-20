
import { Component, OnInit, signal } from '@angular/core';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { UserLanguages } from '../../shared/model/user-languages';
import { LanguagesStore } from '../../shared/store/language.store';


@Component({
  selector: 'app-settings-user-languages',
  templateUrl: './settings-user-languages.component.html',
})
export class SettingsUserLanguagesComponent implements OnInit {

  model = signal<UserLanguages>({} as UserLanguages);

  loading = signal(true);
  saving  = signal(false);
  saved   = signal(false);
  error   = signal<string | null>(null);

    constructor(
    private languagesStore: LanguagesStore,
    private userLanguagesService: UserLanguagesService,
  ) {}

  ngOnInit(): void {
    this.userLanguagesService.get().subscribe({
      next: (res) => {
        this.model.set(res);
        this.loading.set(false);
      },
      error: () => {
        // If your API returns 404 when not set, you can keep an empty model
        this.model.set({} as UserLanguages);
        this.loading.set(false);
      },
    });
  }

 
}
