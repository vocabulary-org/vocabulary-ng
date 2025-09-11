import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/service/user/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../shared/model/user.model';

@Component({
  selector: 'app-new-user',

  imports: [ReactiveFormsModule],

  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent {
  private readonly userService = inject(UserService);

  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  onSubmit() {
    const user: User = {
      username: this.form.value.username!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
    };

    this.userService.createUser(user).subscribe({
      next: (newUser) => {
        console.log('Saved word:', newUser);
        this.form.reset();
      },
      error: (err) => console.error('Failed to create a new user', err),
    });
  }

  get usernamesInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }

  get firstNameIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }

  get lastNameIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }

  get emailIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }
}
