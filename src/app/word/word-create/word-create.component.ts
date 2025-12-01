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

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './word-create.component.html',
  styleUrl: './word-create.component.css',
})
export class WordCreateComponent {
  private readonly wordService = inject(WordService);
  private readonly languageService = inject(LanguageService);
  languages: Language[] = [];

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
    })
  });

  message: string | null = null;
  isError = false;

  ngOnInit(): void {
    this.loadLanguages();
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

  onSubmit() {
    const word: CreateWordRequest = {
      sentence: this.form.value.sentence!,
      translation: this.form.value.translation!,
      description: this.form.value.description!,
      language: { uuid: this.form.value.language!.uuid},     
      languageTo: { uuid: this.form.value.languageTo!.uuid} 
    };

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
