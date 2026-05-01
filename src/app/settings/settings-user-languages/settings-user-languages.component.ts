import { Component, OnInit, signal } from '@angular/core';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { UserLanguages } from '../../shared/model/user-languages';
import { LanguagesStore } from '../../shared/store/language.store';
import { Language } from '../../shared/model/language';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';
import { forkJoin } from 'rxjs';
import { TooltipDirective } from '../../shared/directive/tooltip.directive';

@Component({
  selector: 'app-settings-user-languages',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './settings-user-languages.component.html',
})
export class SettingsUserLanguagesComponent implements OnInit {
  readonly flags = LANGUAGE_FLAGS;
  model = signal<UserLanguages>({} as UserLanguages);

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  savedFading = signal(false);
  dirty = signal(false);
  error = signal<string | null>(null);

  languages = signal<Language[]>([]);

  constructor(
    private languagesStore: LanguagesStore,
    private userLanguagesService: UserLanguagesService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.saved.set(false);
    this.dirty.set(false);
    forkJoin({
      langs: this.languagesStore.getAll$(),
      userLang: this.userLanguagesService.get(),
    }).subscribe({
      next: ({ langs, userLang }) => {
        this.languages.set(langs);
        const langFrom = langs.find((l) => l.uuid === userLang.language?.uuid) ?? null;
        const langTo = langs.find((l) => l.uuid === userLang.languageTo?.uuid) ?? null;
        this.model.set({ ...userLang, language: langFrom, languageTo: langTo });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load language settings.');
        this.loading.set(false);
      },
    });
  }

  onToChange(event: Event) {
    const uuid = (event.target as HTMLSelectElement).value;
    this.model.update((m) => ({ ...m, languageTo: { uuid } }));
    this.dirty.set(true);
  }

  onFromChange(event: Event) {
    const uuid = (event.target as HTMLSelectElement).value;
    this.model.update((m) => ({ ...m, language: { uuid } }));
    this.dirty.set(true);
  }

  getLanguageName(ref: { uuid: string } | null): string {
    if (!ref) return '';
    const lang = this.languages().find((l) => l.uuid === ref.uuid);
    return lang ? lang.name : '';
  }

  cancel(): void {
    this.load();
  }

  save(): void {
    this.saving.set(true);
    this.saved.set(false);
    this.userLanguagesService.createOrUpdate(this.model()).subscribe({
      next: (updated) => {
        this.model.set(updated);
        this.saving.set(false);
        this.saved.set(true);
        this.dirty.set(false);
        setTimeout(() => this.savedFading.set(true), 2000);
        setTimeout(() => { this.saved.set(false); this.savedFading.set(false); }, 2700);
      },
      error: () => {
        this.error.set('Could not save. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
