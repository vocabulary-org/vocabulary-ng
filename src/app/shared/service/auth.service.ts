import { Injectable, signal, effect, inject } from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);

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
    });
  }
}
