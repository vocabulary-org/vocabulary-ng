import { Injectable, signal, effect, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor() {
    effect(() => {
      const event = this.keycloakSignal();
      if (event.type === KeycloakEventType.Ready) {
        this.isAuthenticated.set(typeEventArgs<ReadyArgs>(event.args));
      }
      if (event.type === KeycloakEventType.AuthLogout) {
        this.isAuthenticated.set(false);
      }
      // keycloak-js clears the tokens only when Keycloak rejects the refresh token
      // (session ended); on network errors they are kept, so we don't redirect then.
      if (event.type === KeycloakEventType.AuthRefreshError && !this.keycloak.authenticated) {
        this.isAuthenticated.set(false);
        this.keycloak.login({ redirectUri: window.location.href });
      }
    });

    // Timers are paused while the laptop sleeps or throttled in background tabs,
    // so refresh as soon as the tab is visible again.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.keycloak.authenticated) {
        this.keycloak.updateToken(30).catch(() => undefined);
      }
    });
  }
}
