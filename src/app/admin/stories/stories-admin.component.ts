import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StoryDeAdminService,
  StoryFromTextRequest,
  StoryLength,
} from '../story-de-admin.service';
import { LearnDeutschStoriesService } from '../../learn-deutsch-stories/learn-deutsch-stories.service';
import {
  DeutschLevel,
  Story,
  StorySummary,
} from '../../learn-deutsch-stories/learn-deutsch-stories.model';

type Mode = 'topic' | 'text';
type Status = 'idle' | 'loading' | 'success' | 'error';

export const TEXT_MAX = 5000;

@Component({
  selector: 'app-stories-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stories-admin.component.html',
})
export class StoriesAdminComponent implements OnInit {
  private readonly svc = inject(StoryDeAdminService);
  private readonly storiesSvc = inject(LearnDeutschStoriesService);

  readonly levels: DeutschLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  readonly lengths: { value: StoryLength; label: string }[] = [
    { value: 'SHORT', label: 'Short (3–4 sentences)' },
    { value: 'MEDIUM', label: 'Medium (6–8 sentences)' },
    { value: 'LONG', label: 'Long (10–12 sentences)' },
  ];
  readonly textMax = TEXT_MAX;

  mode: Mode = 'topic';

  // Generate-from-topic fields
  level: DeutschLevel = 'A2';
  topic = '';
  length: StoryLength = 'SHORT';

  // Build-from-text fields
  text = '';
  textTitle = '';
  textTopic = '';
  textLevel: DeutschLevel | '' = '';

  status: Status = 'idle';
  created: Story | null = null;

  // Existing stories management
  stories: StorySummary[] = [];
  listLoading = false;
  listError = false;
  deletingUuid: string | null = null;

  ngOnInit(): void {
    this.loadStories();
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    this.status = 'idle';
    this.created = null;
  }

  get textLength(): number {
    return this.text.length;
  }

  get canSubmit(): boolean {
    if (this.status === 'loading') return false;
    return this.mode === 'topic'
      ? this.topic.trim().length > 0
      : this.text.trim().length > 0 && this.text.length <= this.textMax;
  }

  submit(): void {
    if (!this.canSubmit) return;
    this.status = 'loading';
    this.created = null;
    const request$ = this.mode === 'topic'
      ? this.svc.generate({
          level: this.level,
          topic: this.topic.trim(),
          length: this.length,
        })
      : this.svc.generateFromText(this.buildFromTextRequest());

    request$.subscribe({
      next: (story) => {
        this.created = story;
        this.status = 'success';
        this.loadStories();
      },
      error: () => { this.status = 'error'; },
    });
  }

  loadStories(): void {
    this.listLoading = true;
    this.listError = false;
    this.storiesSvc.getStories().subscribe({
      next: (stories) => {
        this.stories = stories;
        this.listLoading = false;
      },
      error: () => {
        this.listError = true;
        this.listLoading = false;
      },
    });
  }

  remove(story: StorySummary): void {
    if (this.deletingUuid) return;
    if (!confirm(`Delete story "${story.title}"? This cannot be undone.`)) return;
    this.deletingUuid = story.uuid;
    this.svc.delete(story.uuid).subscribe({
      next: () => {
        this.stories = this.stories.filter((s) => s.uuid !== story.uuid);
        this.deletingUuid = null;
        if (this.created?.uuid === story.uuid) this.created = null;
      },
      error: () => {
        this.deletingUuid = null;
        alert('Delete failed. Check logs or try again.');
      },
    });
  }

  private buildFromTextRequest(): StoryFromTextRequest {
    const request: StoryFromTextRequest = { text: this.text.trim() };
    if (this.textTitle.trim()) request.title = this.textTitle.trim();
    if (this.textTopic.trim()) request.topic = this.textTopic.trim();
    if (this.textLevel) request.level = this.textLevel;
    return request;
  }
}
