import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LearnDeutschService } from './learn-deutsch.service';
import { DeutschNoun, PracticeItem } from './learn-deutsch.model';

type PageState = 'idle' | 'loading' | 'error' | 'practicing' | 'complete';
type Mode = 'articles' | 'plural';

const TIMER_MS = 10000;
const TIMER_STEP_MS = 50;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Component({
  selector: 'app-learn-deutsch',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './learn-deutsch.component.html',
})
export class LearnDeutschComponent implements OnDestroy {
  private readonly svc = inject(LearnDeutschService);
  private readonly transloco = inject(TranslocoService);

  readonly articleOptions = ['der', 'die', 'das'];
  readonly SESSION_SIZE = 20;

  state: PageState = 'idle';
  mode: Mode = 'articles';

  items: PracticeItem[] = [];
  currentIndex = 0;
  selected: string | null = null;
  isAnswered = false;
  isHeld = false;
  copied = false;
  correctCount = 0;
  wrongCount = 0;
  timerProgress = 100;

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  get current(): PracticeItem {
    return this.items[this.currentIndex];
  }

  get isCorrect(): boolean {
    return this.selected === this.current.correctAnswer;
  }

  get optionColClass(): string {
    return this.mode === 'articles' ? 'col-4' : 'col-6';
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  selectMode(m: Mode): void {
    this.mode = m;
  }

  start(): void {
    this.clearTimer();
    this.state = 'loading';
    this.svc.getNouns(100, this.transloco.getActiveLang()).subscribe({
      next: (data) => {
        const items = this.mode === 'articles'
          ? this.buildArticleItems(data)
          : this.buildPluralItems(data);
        this.initSession(items);
      },
      error: () => { this.state = 'error'; },
    });
  }

  answer(option: string): void {
    if (this.isAnswered) return;
    this.selected = option;
    this.isAnswered = true;
    if (option === this.current.correctAnswer) {
      this.correctCount++;
    } else {
      this.wrongCount++;
    }
    this.startTimer();
  }

  next(): void {
    this.clearTimer();
    this.advance();
  }

  copyExample(): void {
    const text = this.current.examples
      .map(ex => `${ex.sentenceDe}\n${ex.sentenceTranslation}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    this.copied = true;
    setTimeout(() => { this.copied = false; }, 2000);
  }

  hold(): void {
    this.clearTimer();
    this.isHeld = true;
  }

  restart(): void {
    this.start();
  }

  backToMenu(): void {
    this.clearTimer();
    this.state = 'idle';
  }

  getButtonNgClass(option: string): Record<string, boolean> {
    const isCorrectOption = option === this.current.correctAnswer;
    const isSelectedOption = option === this.selected;
    return {
      'btn-outline-dark': !this.isAnswered,
      'btn-success': this.isAnswered && isCorrectOption,
      'btn-danger': this.isAnswered && isSelectedOption && !isCorrectOption,
      'btn-outline-secondary': this.isAnswered && !isCorrectOption && !isSelectedOption,
    };
  }

  private startTimer(): void {
    this.timerProgress = 100;
    const decrement = (100 / TIMER_MS) * TIMER_STEP_MS;
    this.timerInterval = setInterval(() => {
      this.timerProgress = Math.max(0, this.timerProgress - decrement);
      if (this.timerProgress === 0) {
        this.clearTimer();
        this.advance();
      }
    }, TIMER_STEP_MS);
  }

  private clearTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerProgress = 100;
  }

  private initSession(items: PracticeItem[]): void {
    this.items = items;
    this.currentIndex = 0;
    this.selected = null;
    this.isAnswered = false;
    this.isHeld = false;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.state = 'practicing';
  }

  private buildArticleItems(nouns: DeutschNoun[]): PracticeItem[] {
    return shuffle(nouns).slice(0, this.SESSION_SIZE).map(n => ({
      word: n.wordDe,
      correctAnswer: n.article,
      hint: `${n.article} ${n.wordDe}`,
      options: this.articleOptions,
      translation: n.translation,
      examples: n.examples ?? [],
    }));
  }

  private buildPluralItems(nouns: DeutschNoun[]): PracticeItem[] {
    return shuffle(nouns).slice(0, this.SESSION_SIZE).map(n => ({
      word: n.wordDe,
      correctAnswer: n.pluralDe,
      hint: n.pluralDe,
      options: shuffle([n.pluralDe, ...n.pluralDistractors.slice(0, 3)]),
      translation: n.translation,
      examples: n.examples ?? [],
    }));
  }

  private advance(): void {
    if (this.currentIndex + 1 >= this.items.length) {
      this.state = 'complete';
    } else {
      this.currentIndex++;
      this.selected = null;
      this.isAnswered = false;
      this.isHeld = false;
      this.copied = false;
    }
  }
}
