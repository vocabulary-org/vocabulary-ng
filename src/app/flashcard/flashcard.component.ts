import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlashcardService } from '../shared/service/flashcard/flashcard.service';
import { UserLanguagesService } from '../shared/service/user/user-languages.service';
import { WordView, WordReviewResultType } from '../shared/model/flashcard.model';

type SessionState = 'loading' | 'no-languages' | 'no-words' | 'error' | 'sentence' | 'translation' | 'complete';

interface ReviewEntry {
  word: WordView;
  result: WordReviewResultType;
}

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css',
})
export class FlashcardComponent implements OnInit {
  private readonly flashcardService = inject(FlashcardService);
  private readonly userLanguagesService = inject(UserLanguagesService);

  state: SessionState = 'loading';
  words: WordView[] = [];
  currentIndex = 0;
  reviewed: ReviewEntry[] = [];
  error?: string;

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
    this.userLanguagesService.get().subscribe({
      next: (userLang) => {
        if (!userLang.language?.uuid || !userLang.languageTo?.uuid) {
          this.state = 'no-languages';
          return;
        }
        this.languageUuid = userLang.language.uuid;
        this.languageToUuid = userLang.languageTo.uuid;
        this.loadWords();
      },
      error: () => {
        this.error = 'Could not load settings. Please try again.';
        this.state = 'error';
      },
    });
  }

  private loadWords(): void {
    this.state = 'loading';
    this.flashcardService.getWordsForReview(this.languageUuid!, this.languageToUuid!, 5).subscribe({
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
    this.state = 'translation';
  }

  submit(result: WordReviewResultType): void {
    this.flashcardService.review(this.currentWord.uuid, result).subscribe({
      next: () => {
        this.reviewed.push({ word: this.currentWord, result });
        if (this.currentIndex + 1 >= this.words.length) {
          this.state = 'complete';
        } else {
          this.currentIndex++;
          this.state = 'sentence';
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
