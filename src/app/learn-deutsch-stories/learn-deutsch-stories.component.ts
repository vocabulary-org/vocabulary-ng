import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LearnDeutschStoriesService } from './learn-deutsch-stories.service';
import {
  DeutschLevel,
  Story,
  StoryGap,
  StorySummary,
} from './learn-deutsch-stories.model';

type PageState =
  | 'loading'
  | 'error'
  | 'list'
  | 'storyLoading'
  | 'storyError'
  | 'assess';

type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'gap'; gap: StoryGap };

const LEVEL_BADGE: Record<DeutschLevel, string> = {
  A1: 'bg-success',
  A2: 'bg-success',
  B1: 'bg-primary',
  B2: 'bg-primary',
  C1: 'bg-dark',
  C2: 'bg-dark',
};

@Component({
  selector: 'app-learn-deutsch-stories',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './learn-deutsch-stories.component.html',
})
export class LearnDeutschStoriesComponent implements OnInit {
  private readonly svc = inject(LearnDeutschStoriesService);

  state: PageState = 'loading';
  stories: StorySummary[] = [];
  story: Story | null = null;
  segments: Segment[] = [];
  answers: Record<number, string> = {};
  submitted = false;
  correctCount = 0;

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.state = 'loading';
    this.svc.getStories().subscribe({
      next: (stories) => {
        this.stories = stories;
        this.state = 'list';
      },
      error: () => { this.state = 'error'; },
    });
  }

  openStory(uuid: string): void {
    this.state = 'storyLoading';
    this.svc.getStory(uuid).subscribe({
      next: (story) => this.initStory(story),
      error: () => { this.state = 'storyError'; },
    });
  }

  backToList(): void {
    this.story = null;
    this.state = 'list';
  }

  setAnswer(position: number, value: string): void {
    if (this.submitted) return;
    this.answers[position] = value;
  }

  submit(): void {
    if (!this.story || !this.allAnswered) return;
    this.correctCount = this.story.gaps.filter((g) => this.isGapCorrect(g)).length;
    this.submitted = true;
  }

  retry(): void {
    if (this.story) this.initStory(this.story);
  }

  get totalGaps(): number {
    return this.story?.gaps.length ?? 0;
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  get allAnswered(): boolean {
    return this.totalGaps > 0 && this.answeredCount === this.totalGaps;
  }

  get scorePercent(): number {
    return this.totalGaps === 0
      ? 0
      : Math.round((this.correctCount / this.totalGaps) * 100);
  }

  levelBadgeClass(level: DeutschLevel): string {
    return LEVEL_BADGE[level] ?? 'bg-secondary';
  }

  isGapCorrect(gap: StoryGap): boolean {
    return this.answers[gap.position] === this.correctAnswer(gap);
  }

  correctAnswer(gap: StoryGap): string {
    return gap.options.find((o) => o.correct)?.text ?? '';
  }

  gapSelectClass(gap: StoryGap): Record<string, boolean> {
    return {
      'border-success': this.submitted && this.isGapCorrect(gap),
      'text-success': this.submitted && this.isGapCorrect(gap),
      'border-danger': this.submitted && !this.isGapCorrect(gap),
      'text-danger': this.submitted && !this.isGapCorrect(gap),
    };
  }

  gapHintKey(gap: StoryGap): string {
    return `learnDeutschStories.category.${gap.category}`;
  }

  gapCaseKey(gap: StoryGap): string | null {
    return gap.grammaticalCase
      ? `learnDeutschStories.case.${gap.grammaticalCase}`
      : null;
  }

  private initStory(story: Story): void {
    this.story = story;
    this.segments = this.parseBody(story);
    this.answers = {};
    this.submitted = false;
    this.correctCount = 0;
    this.state = 'assess';
  }

  private parseBody(story: Story): Segment[] {
    const segments: Segment[] = [];
    const re = /\{\{(\d+)\}\}/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(story.body)) !== null) {
      if (match.index > last) {
        segments.push({ kind: 'text', text: story.body.slice(last, match.index) });
      }
      const gap = story.gaps.find((g) => g.position === Number(match![1]));
      if (gap) {
        segments.push({ kind: 'gap', gap });
      } else {
        segments.push({ kind: 'text', text: match[0] });
      }
      last = re.lastIndex;
    }
    if (last < story.body.length) {
      segments.push({ kind: 'text', text: story.body.slice(last) });
    }
    return segments;
  }
}
