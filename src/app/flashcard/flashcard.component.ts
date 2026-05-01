import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FlashcardService } from '../shared/service/flashcard/flashcard.service';
import { UserLanguagesService } from '../shared/service/user/user-languages.service';
import { LanguagesStore } from '../shared/store/language.store';
import { WordView, WordReviewResultType } from '../shared/model/flashcard.model';
import { Language } from '../shared/model/language';
import { LANGUAGE_FLAGS } from '../shared/model/flag';
import { TooltipDirective } from '../shared/directive/tooltip.directive';

type SessionState = 'loading' | 'no-languages' | 'no-words' | 'error' | 'sentence' | 'translation' | 'complete';

interface ReviewEntry {
  word: WordView;
  result: WordReviewResultType;
}

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TooltipDirective],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css',
})
export class FlashcardComponent implements OnInit {
  private readonly flashcardService = inject(FlashcardService);
  private readonly userLanguagesService = inject(UserLanguagesService);
  private readonly languagesStore = inject(LanguagesStore);

  readonly flags = LANGUAGE_FLAGS;

  state: SessionState = 'loading';
  words: WordView[] = [];
  currentIndex = 0;
  reviewed: ReviewEntry[] = [];
  error?: string;
  isFlipped = false;
  skipTransition = false;

  languages: Language[] = [];
  filterMyLanguages = false;
  selectedLanguageUuid = '';
  selectedLanguageToUuid = '';

  private defaultLanguageUuid = '';
  private defaultLanguageToUuid = '';
  private languageUuid?: string;
  private languageToUuid?: string;

  get currentWord(): WordView {
    return this.words[this.currentIndex];
  }

  get rightCount(): number {
    return this.reviewed.filter(r => r.result === 'RIGHT').length;
  }

  get wrongCount(): number {
    return this.reviewed.filter(r => r.result === 'WRONG').length;
  }

  get skipCount(): number {
    return this.reviewed.filter(r => r.result === 'SKIP').length;
  }

  ngOnInit(): void {
    forkJoin({
      langs: this.languagesStore.getAll$(),
      userLang: this.userLanguagesService.get(),
    }).subscribe({
      next: ({ langs, userLang }) => {
        this.languages = langs;
        this.defaultLanguageUuid = userLang.language?.uuid ?? '';
        this.defaultLanguageToUuid = userLang.languageTo?.uuid ?? '';
        this.selectedLanguageUuid = this.defaultLanguageUuid;
        this.selectedLanguageToUuid = this.defaultLanguageToUuid;
        this.filterMyLanguages = !!(this.defaultLanguageUuid && this.defaultLanguageToUuid);

        if (!this.selectedLanguageUuid || !this.selectedLanguageToUuid) {
          this.state = 'no-languages';
          return;
        }
        this.languageUuid = this.selectedLanguageUuid;
        this.languageToUuid = this.selectedLanguageToUuid;
        this.loadWords();
      },
      error: () => {
        this.error = 'Could not load settings. Please try again.';
        this.state = 'error';
      },
    });
  }

  onLanguageFilterChange(): void {
    if (!this.filterMyLanguages) return;
    if (!this.defaultLanguageUuid || !this.defaultLanguageToUuid) {
      this.filterMyLanguages = false;
      return;
    }
    this.selectedLanguageUuid = this.defaultLanguageUuid;
    this.selectedLanguageToUuid = this.defaultLanguageToUuid;
    this.languageUuid = this.defaultLanguageUuid;
    this.languageToUuid = this.defaultLanguageToUuid;
    this.loadWords();
  }

  onLanguageChange(): void {
    if (!this.selectedLanguageUuid || !this.selectedLanguageToUuid) return;
    if (this.selectedLanguageUuid === this.selectedLanguageToUuid) return;
    this.filterMyLanguages = false;
    this.languageUuid = this.selectedLanguageUuid;
    this.languageToUuid = this.selectedLanguageToUuid;
    this.loadWords();
  }

  private loadWords(): void {
    this.state = 'loading';
    this.isFlipped = false;
    this.flashcardService.getWordsForReview(this.languageUuid!, this.languageToUuid!, 10).subscribe({
      next: (words) => {
        if (words.length === 0) {
          this.state = 'no-words';
          return;
        }
        this.words = words;
        this.currentIndex = 0;
        this.reviewed = [];
        this.state = 'sentence';
      },
      error: () => {
        this.error = 'Could not load words. Please try again.';
        this.state = 'no-words';
      },
    });
  }

  reveal(): void {
    this.isFlipped = true;
    this.state = 'translation';
  }

  submit(result: WordReviewResultType): void {
    this.flashcardService.review(this.currentWord.uuid, result).subscribe({
      next: () => {
        this.reviewed.push({ word: this.currentWord, result });

        const advance = () => {
          if (this.currentIndex + 1 >= this.words.length) {
            this.state = 'complete';
          } else {
            this.currentIndex++;
            this.state = 'sentence';
          }
        };

        if (this.isFlipped) {
          this.skipTransition = true;
          this.isFlipped = false;
          setTimeout(() => {
            this.skipTransition = false;
            advance();
          }, 50);
        } else {
          advance();
        }
      },
      error: () => {
        this.error = 'Could not save review. Please try again.';
      },
    });
  }

  restart(): void {
    this.loadWords();
  }

  retry(): void {
    this.error = undefined;
    this.ngOnInit();
  }
}
