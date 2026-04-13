import { AfterViewInit, Component, inject, NgZone, OnDestroy } from '@angular/core';
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
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-new-user',

  imports: [ReactiveFormsModule, CommonModule, TranslocoModule],

  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent implements AfterViewInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly keycloak = inject(Keycloak);
  private readonly ngZone = inject(NgZone);
  private readonly transloco = inject(TranslocoService);

  readonly captchaEnabled = !!environment.turnstileSiteKey;
  private readonly turnstileSiteKey = environment.turnstileSiteKey;
  turnstileToken: string | null = null;
  private widgetId: string | null = null;
  private turnstileScript: HTMLScriptElement | null = null;

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
  isLoading = false;
  registrationSuccess = false;

  ngAfterViewInit(): void {
    if (!this.captchaEnabled) return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const win = window as any;
      this.widgetId = win.turnstile.render('#turnstile-container', {
        sitekey: this.turnstileSiteKey,
        callback: (token: string) => {
          this.ngZone.run(() => { this.turnstileToken = token; });
        },
        'expired-callback': () => {
          this.ngZone.run(() => { this.turnstileToken = null; });
        },
        'error-callback': () => {
          this.ngZone.run(() => { this.turnstileToken = null; });
        },
      });
    };
    document.head.appendChild(script);
    this.turnstileScript = script;
  }

  ngOnDestroy(): void {
    const win = window as any;
    if (this.widgetId !== null && win.turnstile) {
      win.turnstile.remove(this.widgetId);
    }
    if (this.turnstileScript) {
      document.head.removeChild(this.turnstileScript);
    }
  }

  onSubmit(): void {
    if (this.captchaEnabled && !this.turnstileToken) return;

    const user: User = {
      username: this.form.value.username!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
    };

    this.isLoading = true;
    this.userService.createUser(user, this.turnstileToken ?? undefined).subscribe({
      next: (response: HttpResponse<User>) => {
        this.isLoading = false;
        if (response.status === 201) {
          this.isError = false;
          this.registrationSuccess = true;
          this.form.disable();
          this.message = this.transloco.translate('register.successMessage');
        } else {
          this.isError = true;
          this.message = `Unexpected status: ${response.status}`;
          console.error('Error status:', response.status);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.isError = true;
        const body = error.error;
        this.message = (body && body.message) ? body.message : this.transloco.translate('register.errorMessage');
        console.error('Error status:', error.status, 'body:', body);
      }
    });
  }

  login() {
    this.keycloak.login();
  }

  get isSubmitDisabled(): boolean {
    return this.form.invalid || (this.captchaEnabled && !this.turnstileToken);
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
