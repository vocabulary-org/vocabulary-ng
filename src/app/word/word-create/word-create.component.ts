import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-word-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './word-create.component.html',
  styleUrl: './word-create.component.css'
})
export class WordCreateComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [ Validators.email, Validators.required]

    }),
    password: new FormControl('', {
    validators: [Validators.required, Validators.minLength(6)]
    })

  });

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail+" - "+enteredPassword);


  }

}
