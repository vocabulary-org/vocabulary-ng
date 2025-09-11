import { Component, inject} from '@angular/core';
import { WordService } from '../../shared/service/word/word.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateWordRequest } from '../../shared/model/word.model';

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      validators: [Validators.minLength(2)]
    }),
  });

  onSubmit() {

    const word: CreateWordRequest = {
    sentence: this.form.value.sentence!,
    translation: this.form.value.translation!,
    description: this.form.value.description!,
    language: 'ENGLISH',       // hardcoded
    languageTo: 'ITALIAN'      // hardcoded
  };

  this.wordService.addWord(word).subscribe({
    next: savedWord => {
      console.log('Saved word:', savedWord);
      this.form.reset();
    },
    error: err => console.error('Failed to save word', err)
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
