import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/service/user/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../shared/model/user.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-user',

  imports: [ReactiveFormsModule, CommonModule],

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

  message: string | null = null;
  isError = false;

  onSubmit(): void {
    const user: User = {
      username: this.form.value.username!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
    };

    this.userService.createUser(user).subscribe({
      next: (response: HttpResponse<User>) => {
        if (response.status === 201) {
          this.isError = false;
          this.message = '✅ Check your email to complete registration.';
        } else {
          this.isError = true;
          this.message = `Unexpected status: ${response.status}`;
          console.error('Error status:', response.status);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isError = true;
        const body = error.error; // could be string (text/plain) or object (application/json)
        this.message = (body && body.message) ? body.message : '❌ Something went wrong.';
        console.error('Error status:', error.status, 'body:', body);
      }
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
      this.form.controls.firstName.touched &&
      this.form.controls.firstName.dirty &&
      this.form.controls.firstName.invalid
    );
  }

  get lastNameIsInvalid() {
    return (
      this.form.controls.lastName.touched &&
      this.form.controls.lastName.dirty &&
      this.form.controls.lastName.invalid
    );
  }

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
}
