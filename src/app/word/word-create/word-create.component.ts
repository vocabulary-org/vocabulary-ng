import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './word-create.component.html',
  styleUrl: './word-create.component.css',
})
export class WordCreateComponent {
  form = new FormGroup({
    sentence: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    translation: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  onSubmit() {
    const enteredSentence = this.form.value.sentence;
    const enteredTranslation = this.form.value.translation;
    console.log(enteredSentence + ' - ' + enteredTranslation);
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
