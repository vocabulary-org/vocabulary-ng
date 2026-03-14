import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { WordService } from '../../shared/service/word/word.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateWordRequest, TagSuggestion, Word } from '../../shared/model/word.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Language } from '../../shared/model/language';

import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AutoTranslationComponent } from '../auto-translation/auto-translation.component';
import { LanguagesStore } from '../../shared/store/language.store';
import { UserLanguages } from '../../shared/model/user-languages';
import { UserLanguagesService } from '../../shared/service/user/user-languages.service';
import { TagService } from '../../shared/service/word/tag.service';

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AutoTranslationComponent],
  templateUrl: './word-create-update.component.html',
  styleUrl: './word-create-update.component.css',
})
export class WordCreateUpdateComponent {
  @ViewChild('sentenceInput') sentenceInput!: ElementRef<HTMLInputElement>;
  private readonly wordService = inject(WordService);
  private readonly languageStore = inject(LanguagesStore);
  private readonly userLanguagesService = inject(UserLanguagesService);
  private readonly tagService = inject(TagService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // State
  languages = signal<Language[]>([]);
  isEdit = signal(false);
  uuid = signal<string | null>(null);
  isTranslating = signal(false);
  isQuotaReached = signal(false);
  message = signal<string | null>(null);
  isError = signal(false);
  isSuggestingTags = signal(false);
  suggestedTags = signal<TagSuggestion[]>([]);
  selectedTags = signal<TagSuggestion[]>([]);

  private messageTimer: ReturnType<typeof setTimeout> | null = null;

  originalFormValue: any;

  form = new FormGroup({
    sentence: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    translation: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', {
      validators: [Validators.minLength(2)],
    }),
    language: new FormControl<Language | null>(null, {
      validators: [Validators.required],
    }),
    languageTo: new FormControl<Language | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    // check if we are in edit mode (URL: /words/edit/:uuid)
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
        const langFrom =
          langs.find((l) => l.uuid === word.language.uuid) ?? null;
        const langTo =
          langs.find((l) => l.uuid === word.languageTo.uuid) ?? null;
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
      error: (err) => {
        console.error('Error loading word for edit', err);
        this.isError.set(true);
        this.message.set('❌ Unable to load the word for editing.');
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
        const langFrom =
          langs.find((l) => l.uuid === userLang.language?.uuid) ?? null;
        const langTo =
          langs.find((l) => l.uuid === userLang.languageTo?.uuid) ?? null;
        this.form.patchValue({
          language: langFrom,
          languageTo: langTo,
        });
        this.originalFormValue = this.form.getRawValue();
      },
      error: (err) => {
        console.error('Error loading word for edit', err);
        this.isError.set(true);
        this.message.set('❌ Unable to load the word for editing.');
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
      next: (tags) => this.suggestedTags.set(tags),
      error: (err) => console.error('Tag suggestion failed', err),
      complete: () => this.isSuggestingTags.set(false),
    });
  }

  toggleTag(tag: TagSuggestion, event: MouseEvent): void {
    (event.currentTarget as HTMLElement).blur();
    const current = this.selectedTags();
    const exists = current.some((t) => t.tag === tag.tag);
    this.selectedTags.set(
      exists ? current.filter((t) => t.tag !== tag.tag) : [...current, tag]
    );
  }

  isTagSelected(tag: TagSuggestion): boolean {
    return this.selectedTags().some((t) => t.tag === tag.tag);
  }

  onSubmit() {
    const word: CreateWordRequest = {
      sentence: this.form.value.sentence!,
      translation: this.form.value.translation!,
      description: this.form.value.description!,
      language: { uuid: this.form.value.language!.uuid },
      languageTo: { uuid: this.form.value.languageTo!.uuid },
      tags: this.selectedTags(),
    };

    if (this.isEdit()) {
      // 🔁 UPDATE
      this.wordService.updateWord(this.uuid()!, word).subscribe({
        next: (response) => {
          this.setSuccessMessage('✅ Your word has been successfully updated.');
          // optional: navigate back to list
          setTimeout(() => {
            this.router.navigate(['/word/list']); // ✅ redirect to list
          }, 800);
        },
        error: (error: HttpErrorResponse) => {
          this.isError.set(true);
          const body = error.error;
          this.message =
            body && body.message
              ? body.message
              : '❌ Something went wrong while updating.';
          console.error('Update error status:', error.status, 'body:', body);
        },
      });
      return;
    }

    this.wordService.addWord(word).subscribe({
      next: (response: HttpResponse<Word>) => {
        if (response.status === 201) {
          this.setSuccessMessage('✅ Your word has been successfully added.');
          this.form.controls.sentence.reset();
          this.form.controls.translation.reset();
          this.form.controls.description.reset();
          this.suggestedTags.set([]);
          this.selectedTags.set([]);
          setTimeout(() => this.sentenceInput.nativeElement.focus());
        } else {
          this.isError.set(true);
          this.message.set(`Unexpected status: ${response.status}`);
          console.error('Error status:', response.status);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isError.set(true);
        const body = error.error; // could be string (text/plain) or object (application/json)
        this.message =
          body && body.message ? body.message : '❌ Something went wrong.';
        console.error('Error status:', error.status, 'body:', body);
      },
    });
  }

  private setSuccessMessage(text: string): void {
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.isError.set(false);
    this.message.set(text);
    this.messageTimer = setTimeout(() => this.message.set(null), 4000);
  }

  clearMessage(): void {
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.message.set(null);
  }

  onCancel(): void {
    if (!this.originalFormValue) {
      return;
    }
    this.form.reset(this.originalFormValue);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.selectedTags.set([...this.suggestedTags()]);
  }

  swapLanguages(): void {
    const from = this.form.value.language;
    const to = this.form.value.languageTo;

    this.form.patchValue({
      language: to,
      languageTo: from,
    });
  }

  onTranslated(text: string): void {
    this.form.controls.translation.setValue(text);
    this.form.controls.translation.markAsDirty();
  }

  get sentenceIsInvalid() {
    return (
      this.form.controls.sentence.touched &&
      this.form.controls.sentence.dirty &&
      this.form.controls.sentence.invalid
    );
  }

  get translationIsInvalid() {
    return (
      this.form.controls.translation.touched &&
      this.form.controls.translation.dirty &&
      this.form.controls.translation.invalid
    );
  }
}
