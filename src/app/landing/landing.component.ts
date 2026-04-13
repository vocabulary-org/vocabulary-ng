import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import Keycloak from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, DisclaimerComponent, TranslocoModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  authenticated = false;

  images = [
    'slideshow/original.png',
    'slideshow/cgpt-gen-1.png',
    'slideshow/cgpt-gen-2.png',
    'slideshow/cgpt-3.png'
  ];
  currentIndex = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }
      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.images.length > 1) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  login() {
    this.keycloak.login();
  }

  forgotPassword() {
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    const url = `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/login-actions/reset-credentials?client_id=${this.keycloak.clientId}&redirect_uri=${redirectUri}`;
    window.location.href = url;
  }
}
