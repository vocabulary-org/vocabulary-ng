import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { WordService } from '../../shared/service/word/word.service';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { LanguageService } from '../../shared/service/language.service';
import { Word } from '../../shared/model/word.model';
import { Language } from '../../shared/model/language';
import { RouterLink } from '@angular/router';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css',
})
export class WordListComponent implements OnInit, OnDestroy {
  public words: Word[] = [];
  public page: any;
  public pageSize = 10;
  public loading = false;
  public error?: string;
  public readonly flags = LANGUAGE_FLAGS;
  public currentPage = 0;

  public searchControl = new FormControl('', { nonNullable: true });
  public searchActive = false;

  public sortDir?: 'asc' | 'desc';
  public filterMyLanguages = false;
  public noLanguageSettings = false;

  public availableLanguages: Language[] = [];
  public filterFromUuid = '';
  public filterToUuid = '';

  private readonly wordService = inject(WordService);
  private readonly userLanguagesService = inject(UserLanguagesService);
  private readonly languageService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  get selectedFromLanguage(): Language | undefined {
    return this.availableLanguages.find(l => l.uuid === this.filterFromUuid);
  }

  get selectedToLanguage(): Language | undefined {
    return this.availableLanguages.find(l => l.uuid === this.filterToUuid);
  }

  ngOnInit() {
    this.languageService.getAllLanguages().subscribe({
      next: (langs) => this.availableLanguages = langs,
    });
    this.reload();
    this.setupSearchListener();
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((searchTerm) => {
        this.searchActive = searchTerm.trim().length > 0;
        this.reload(0);
      });
  }

  public reload(page: number = 0): void {
    this.loading = true;
    const searchTerm = this.searchActive ? this.searchControl.value.trim() : undefined;

    const fromName = this.filterFromUuid
      ? this.availableLanguages.find(l => l.uuid === this.filterFromUuid)?.name
      : undefined;
    const toName = this.filterToUuid
      ? this.availableLanguages.find(l => l.uuid === this.filterToUuid)?.name
      : undefined;

    this.wordService.listWords(page, this.pageSize, searchTerm, this.sortDir, fromName, toName)
      .subscribe({
        next: (pageData) => {
          this.page = pageData;
          this.words = pageData.content;
          this.currentPage = pageData.page.number;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error while loading words';
          this.loading = false;
        },
      });
  }

  public goToPage(page: number): void {
    if (page < 0 || (this.page && page >= this.page.page.totalPages)) {
      return;
    }
    this.reload(page);
  }

  public clearSearch(): void {
    this.searchControl.setValue('');
    this.searchActive = false;
    this.reload(0);
  }

  public swapLanguages(): void {
    [this.filterFromUuid, this.filterToUuid] = [this.filterToUuid, this.filterFromUuid];
    this.reload(0);
  }

  public toggleSort(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.reload(0);
  }

  public onLanguageFilterChange(): void {
    this.noLanguageSettings = false;
    if (!this.filterMyLanguages) {
      this.filterFromUuid = '';
      this.filterToUuid = '';
      this.reload(0);
      return;
    }

    forkJoin({
      userLang: this.userLanguagesService.get(),
      languages: this.languageService.getAllLanguages(),
    }).subscribe({
      next: ({ userLang, languages }) => {
        this.availableLanguages = languages;
        const from = languages.find(l => l.uuid === userLang.language?.uuid);
        const to = languages.find(l => l.uuid === userLang.languageTo?.uuid);
        if (!from && !to) {
          this.noLanguageSettings = true;
          this.filterMyLanguages = false;
        } else {
          this.filterFromUuid = from?.uuid ?? '';
          this.filterToUuid = to?.uuid ?? '';
          this.reload(0);
        }
      },
      error: () => {
        this.error = 'Could not load language settings';
        this.filterMyLanguages = false;
      },
    });
  }

  public onLanguageDropdownChange(): void {
    this.filterMyLanguages = false;
    this.reload(0);
  }

  public onDelete(word: Word): void {
    const confirmed = confirm(`Do you really want to delete "${word.sentence}"?`);
    if (!confirmed) return;

    this.wordService.delete(word.uuid).subscribe({
      next: () => this.reload(this.currentPage),
      error: () => { this.error = 'Error while deleting word'; },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
