import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordView, WordReviewResultType } from '../shared/model/flashcard.model';
import { DEMO_LANGUAGES, DemoLangCode, DemoLanguage, getDemoWords } from '../shared/data/demo-words';

type SessionState = 'pick-language' | 'sentence' | 'translation' | 'complete';

interface ReviewEntry {
  word: WordView;
  result: WordReviewResultType;
}

@Component({
  selector: 'app-demo-flashcard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './demo-flashcard.component.html',
  styleUrl: './demo-flashcard.component.css',
})
export class DemoFlashcardComponent {
  readonly languages: DemoLanguage[] = DEMO_LANGUAGES;

  state: SessionState = 'pick-language';
  fromLang: DemoLangCode = 'en';
  toLang: DemoLangCode = 'es';

  words: WordView[] = [];
  currentIndex = 0;
  reviewed: ReviewEntry[] = [];
  isFlipped = false;
  skipTransition = false;

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

  get fromLanguage(): DemoLanguage {
    return this.languages.find(l => l.code === this.fromLang)!;
  }

  get toLanguage(): DemoLanguage {
    return this.languages.find(l => l.code === this.toLang)!;
  }

  get canStart(): boolean {
    return this.fromLang !== this.toLang;
  }

  onFromChange(): void {
    if (this.fromLang === this.toLang) {
      const other = this.languages.find(l => l.code !== this.fromLang);
      if (other) this.toLang = other.code;
    }
  }

  onToChange(): void {
    if (this.fromLang === this.toLang) {
      const other = this.languages.find(l => l.code !== this.toLang);
      if (other) this.fromLang = other.code;
    }
  }

  start(): void {
    this.words = getDemoWords(this.fromLang, this.toLang);
    this.currentIndex = 0;
    this.reviewed = [];
    this.isFlipped = false;
    this.state = 'sentence';
  }

  reveal(): void {
    this.isFlipped = true;
    this.state = 'translation';
  }

  submit(result: WordReviewResultType): void {
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
  }

  restart(): void {
    this.start();
  }

  changeLang(): void {
    this.state = 'pick-language';
  }
}
