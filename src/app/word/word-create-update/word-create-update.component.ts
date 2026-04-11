import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { WordService } from '../../shared/service/word/word.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CreateWordRequest, TagSuggestion, Word } from '../../shared/model/word.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Language } from '../../shared/model/language';

import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AutoTranslationComponent } from '../auto-translation/auto-translation.component';
import { LanguagesStore } from '../../shared/store/language.store';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { TagService } from '../../shared/service/word/tag.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

class TouchedDirtyMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control?.invalid && control.dirty && control.touched);
  }
}

@Component({
  selector: 'app-word-create',
  standalone: true,
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedDirtyMatcher }],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AutoTranslationComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './word-create-update.component.html',
  styleUrl: './word-create-update.component.css',
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(18px)' }),
        animate('420ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px) scale(0.98)' }),
        animate('360ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('staggerItems', [
      transition(':enter', [
        query('.anim-item', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(60, [animate('280ms ease-out', style({ opacity: 1, transform: 'none' }))])
        ], { optional: true })
      ])
    ])
  ],
})
export class WordCreateUpdateComponent {
  @ViewChild('sentenceInput') sentenceInput!: ElementRef<HTMLTextAreaElement>;
  private readonly wordService = inject(WordService);
  private readonly languageStore = inject(LanguagesStore);
  private readonly userLanguagesService = inject(UserLanguagesService);
  private readonly tagService = inject(TagService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  languages = signal<Language[]>([]);
  isEdit = signal(false);
  uuid = signal<string | null>(null);
  message = signal<string | null>(null);
  isError = signal(false);
  isSuggestingTags = signal(false);
  isSubmitting = signal(false);
  suggestedTags = signal<TagSuggestion[]>([]);
  selectedTags = signal<TagSuggestion[]>([]);

  private messageTimer: ReturnType<typeof setTimeout> | null = null;
  originalFormValue: any;

  form = new FormGroup({
    sentence: new FormControl('', {
      validators: [Validators.minLength(2)],
    }),
    translation: new FormControl('', {
      validators: [Validators.minLength(2)],
    }),
    description: new FormControl('', {
      validators: [Validators.minLength(2)],
    }),
    language: new FormControl<Language | null>(null, {
      validators: [],
    }),
    languageTo: new FormControl<Language | null>(null, {
      validators: [],
    }),
  });

  get formCompletion(): number {
    const controls = ['sentence', 'translation', 'language', 'languageTo'] as const;
    const filled = controls.filter(c => {
      const val = this.form.get(c)?.value;
      return val !== null && val !== '' && val !== undefined;
    }).length;
    return Math.round((filled / controls.length) * 100);
  }

  get progressState(): string {
    return this.formCompletion === 100 ? 'complete' : 'partial';
  }

  ngOnInit(): void {
    const paramUuid = this.route.snapshot.paramMap.get('uuid');
    if (!paramUuid) {
      this.loadWordForCreate();
      return;
    }
    this.isEdit.set(true);
    this.uuid.set(paramUuid);
    this.loadWordForEdit();
  }

  private loadWordForEdit(): void {
    forkJoin({
      langs: this.languageStore.getAll$(),
      word: this.wordService.getById(this.uuid()!),
    }).subscribe({
      next: ({ langs, word }) => {
        this.languages.set(langs);
        const langFrom = langs.find(l => l.uuid === word.language.uuid) ?? null;
        const langTo = langs.find(l => l.uuid === word.languageTo.uuid) ?? null;
        this.form.patchValue({
          sentence: word.sentence,
          translation: word.translation,
          description: word.description,
          language: langFrom,
          languageTo: langTo,
        });
        if (word.tags?.length) {
          this.selectedTags.set(word.tags);
          this.suggestedTags.set(word.tags);
        }
        this.originalFormValue = this.form.getRawValue();
      },
      error: () => {
        this.isError.set(true);
        this.message.set('Unable to load the word for editing.');
      },
    });
  }

  private loadWordForCreate(): void {
    forkJoin({
      langs: this.languageStore.getAll$(),
      userLang: this.userLanguagesService.get(),
    }).subscribe({
      next: ({ langs, userLang }) => {
        this.languages.set(langs);
        const langFrom = langs.find(l => l.uuid === userLang.language?.uuid) ?? null;
        const langTo = langs.find(l => l.uuid === userLang.languageTo?.uuid) ?? null;
        this.form.patchValue({ language: langFrom, languageTo: langTo });
        this.originalFormValue = this.form.getRawValue();
      },
      error: () => {
        this.isError.set(true);
        this.message.set('Unable to load language settings.');
      },
    });
  }

  suggestTags(): void {
    const sentence = this.form.value.sentence?.trim();
    const languageCode = this.form.value.language?.code;
    if (!sentence || !languageCode) return;

    this.isSuggestingTags.set(true);
    this.suggestedTags.set([]);
    this.selectedTags.set([]);

    this.tagService.suggest({ sentence, languageCode }).subscribe({
      next: tags => this.suggestedTags.set(tags),
      error: err => console.error('Tag suggestion failed', err),
      complete: () => this.isSuggestingTags.set(false),
    });
  }

  toggleTag(tag: TagSuggestion, event?: MouseEvent): void {
    if (event) (event.currentTarget as HTMLElement).blur();
    const current = this.selectedTags();
    const exists = current.some(t => t.tag === tag.tag);
    this.selectedTags.set(exists ? current.filter(t => t.tag !== tag.tag) : [...current, tag]);
  }

  onTagChipChange(tag: TagSuggestion, selected: boolean): void {
    const current = this.selectedTags();
    if (selected) {
      if (!current.some(t => t.tag === tag.tag)) this.selectedTags.set([...current, tag]);
    } else {
      this.selectedTags.set(current.filter(t => t.tag !== tag.tag));
    }
  }

  isTagSelected(tag: TagSuggestion): boolean {
    return this.selectedTags().some(t => t.tag === tag.tag);
  }

  onSubmit(): void {
    const word: CreateWordRequest = {
      sentence: this.form.value.sentence!,
      translation: this.form.value.translation!,
      description: this.form.value.description!,
      language: { uuid: this.form.value.language!.uuid },
      languageTo: { uuid: this.form.value.languageTo!.uuid },
      tags: this.selectedTags(),
    };

    this.isSubmitting.set(true);

    if (this.isEdit()) {
      this.wordService.updateWord(this.uuid()!, word).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.setSuccessMessage('Word updated successfully!');
          setTimeout(() => this.router.navigate(['/word/list']), 900);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.isError.set(true);
          const body = error.error;
          this.message.set(body?.message ?? 'Something went wrong while updating.');
        },
      });
      return;
    }

    this.wordService.addWord(word).subscribe({
      next: (response: HttpResponse<Word>) => {
        this.isSubmitting.set(false);
        if (response.status === 201) {
          this.setSuccessMessage('Word added to your vocabulary!');
          this.form.controls.sentence.reset();
          this.form.controls.translation.reset();
          this.form.controls.description.reset();
          this.suggestedTags.set([]);
          this.selectedTags.set([]);
          setTimeout(() => this.sentenceInput.nativeElement.focus());
        } else {
          this.isError.set(true);
          this.message.set(`Unexpected status: ${response.status}`);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.isError.set(true);
        const body = error.error;
        this.message.set(body?.message ?? 'Something went wrong.');
      },
    });
  }

  private setSuccessMessage(text: string): void {
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.isError.set(false);
    this.message.set(text);
    this.messageTimer = setTimeout(() => this.message.set(null), 4500);
  }

  clearMessage(): void {
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.message.set(null);
  }

  onCancel(): void {
    if (!this.originalFormValue) return;
    this.form.reset(this.originalFormValue);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.selectedTags.set([...this.suggestedTags()]);
  }

  swapLanguages(): void {
    const from = this.form.value.language;
    const to = this.form.value.languageTo;
    this.form.patchValue({ language: to, languageTo: from });
  }

  compareByUuid(a: Language | null, b: Language | null): boolean {
    return a?.uuid === b?.uuid;
  }

  onTranslated(text: string): void {
    this.form.controls.translation.setValue(text);
    this.form.controls.translation.markAsDirty();
  }

  get sentenceIsInvalid(): boolean {
    const c = this.form.controls.sentence;
    return c.touched && c.dirty && c.invalid;
  }

  get translationIsInvalid(): boolean {
    const c = this.form.controls.translation;
    return c.touched && c.dirty && c.invalid;
  }
}
