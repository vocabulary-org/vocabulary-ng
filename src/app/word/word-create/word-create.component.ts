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

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './word-create.component.html',
  styleUrl: './word-create.component.css',
})
export class WordCreateComponent {
  private readonly wordService = inject(WordService);

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
    language: new FormControl<string>('ENGLISH', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    languageTo: new FormControl<string>('ITALIAN', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  message: string | null = null;
  isError = false;

  onSubmit() {
    const word: CreateWordRequest = {
      sentence: this.form.value.sentence!,
      translation: this.form.value.translation!,
      description: this.form.value.description!,
      language: 'ENGLISH', // hardcoded
      languageTo: 'ITALIAN', // hardcoded
    };

    this.wordService.addWord(word).subscribe({
      next: (response: HttpResponse<Word>) => {
        if (response.status === 201) {
          this.isError = false;
          this.message = '✅ Your word has been successfully added.';
          this.form.reset({ language: 'EN', languageTo: 'DE' });
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
