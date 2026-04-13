import { Component, effect, inject, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import Keycloak from 'keycloak-js';
import {
  HasRolesDirective,
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    HasRolesDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    TranslocoModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authenticated = false;
  isScrolled = false;
  mobileMenuOpen = false;

  readonly langs = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
  ];

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly transloco = inject(TranslocoService);

  get activeLang(): string {
    return this.transloco.getActiveLang();
  }

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

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 4;
  }

  setLang(code: string): void {
    this.transloco.setActiveLang(code);
    localStorage.setItem('lang', code);
  }

  login(): void { this.keycloak.login(); }
  logout(): void { this.keycloak.logout(); }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }
}
