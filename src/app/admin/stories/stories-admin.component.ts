import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryDeAdminService, StoryLength } from '../story-de-admin.service';
import { DeutschLevel, Story } from '../../learn-deutsch-stories/learn-deutsch-stories.model';

type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-stories-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stories-admin.component.html',
})
export class StoriesAdminComponent {
  private readonly svc = inject(StoryDeAdminService);

  readonly levels: DeutschLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  readonly lengths: { value: StoryLength; label: string }[] = [
    { value: 'SHORT', label: 'Short (3–4 sentences)' },
    { value: 'MEDIUM', label: 'Medium (6–8 sentences)' },
    { value: 'LONG', label: 'Long (10–12 sentences)' },
  ];

  level: DeutschLevel = 'A2';
  topic = '';
  length: StoryLength = 'SHORT';

  status: Status = 'idle';
  created: Story | null = null;

  get canSubmit(): boolean {
    return this.topic.trim().length > 0 && this.status !== 'loading';
  }

  generate(): void {
    if (!this.canSubmit) return;
    this.status = 'loading';
    this.created = null;
    this.svc.generate({
      level: this.level,
      topic: this.topic.trim(),
      length: this.length,
    }).subscribe({
      next: (story) => {
        this.created = story;
        this.status = 'success';
      },
      error: () => { this.status = 'error'; },
    });
  }
}
