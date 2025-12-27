import { Component, inject } from '@angular/core';
import { WordService } from '../../shared/service/word/word.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateWordRequest, Word } from '../../shared/model/word.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Language } from '../../shared/model/language';
import { LanguageService } from '../../shared/service/word/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AutoTranslationComponent } from "../auto-translation/auto-translation.component";

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AutoTranslationComponent],
  templateUrl: './word-create-update.component.html',
  styleUrl: './word-create-update.component.css',
})


export class WordCreateUpdateComponent {
  private readonly wordService = inject(WordService);
  private readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  languages: Language[] = [];
  isEdit: boolean = false;
  uuid!: string;
  isTranslating = false;
  originalFormValue: any;
  isQuotaReached = false;
  message: string | null = null;
  isError = false;

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
      this.loadLanguages();
      return;
    }

    this.isEdit = true;
    this.uuid = paramUuid;
    this.loadWordForEdit();

  }

  private loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe({
      next: (langs) => {
        this.languages = langs;

        // optional: set some defaults, e.g. EN -> IT
        // const en = langs.find(l => l.name === 'English');
        // const it = langs.find(l => l.name === 'Italian');
        // if (en && it) {
        //   this.form.patchValue({ language: en, languageTo: it });
        // }
      },
      error: (err) => {
        console.error('Error loading languages', err);
      },
    });
  }

  private loadWordForEdit(): void {
    forkJoin({
      langs: this.languageService.getAllLanguages(),
      word: this.wordService.getById(this.uuid),
    }).subscribe({
      next: ({ langs, word }) => {
        this.languages = langs;
        const langFrom = langs.find(l => l.uuid === word.language.uuid) ?? null;
        const langTo = langs.find(l => l.uuid === word.languageTo.uuid) ?? null;
        this.form.patchValue({
          sentence: word.sentence,
          translation: word.translation,
          description: word.description,
          language: langFrom,
          languageTo: langTo,
        });
        this.originalFormValue = this.form.getRawValue();
      },
      error: (err) => {
        console.error('Error loading word for edit', err);
        this.isError = true;
        this.message = '❌ Unable to load the word for editing.';
      },
    });
  }


  onSubmit() {
    const word: CreateWordRequest = {
      sentence: this.form.value.sentence!,
      translation: this.form.value.translation!,
      description: this.form.value.description!,
      language: { uuid: this.form.value.language!.uuid },
      languageTo: { uuid: this.form.value.languageTo!.uuid },
    };


    if (this.isEdit) {
      // 🔁 UPDATE
      this.wordService.updateWord(this.uuid, word).subscribe({
        next: (response) => {
          this.isError = false;
          this.message = '✅ Your word has been successfully updated.';
          // optional: navigate back to list
          setTimeout(() => {
            this.router.navigate(['/word/list']); // ✅ redirect to list
          }, 800)

        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          const body = error.error;
          this.message =
            body && body.message ? body.message : '❌ Something went wrong while updating.';
          console.error('Update error status:', error.status, 'body:', body);
        },
      });
      return;
    }

    this.wordService.addWord(word).subscribe({
      next: (response: HttpResponse<Word>) => {
        if (response.status === 201) {
          this.isError = false;
          this.message = '✅ Your word has been successfully added.';
          this.form.reset({});
        } else {
          this.isError = true;
          this.message = `Unexpected status: ${response.status}`;
          console.error('Error status:', response.status);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isError = true;
        const body = error.error; // could be string (text/plain) or object (application/json)
        this.message =
          body && body.message ? body.message : '❌ Something went wrong.';
        console.error('Error status:', error.status, 'body:', body);
      },
    });
  }

  onCancel(): void {
    if (!this.originalFormValue) {
      return;
    }
    this.form.reset(this.originalFormValue);
    this.form.markAsPristine();
    this.form.markAsUntouched();
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
