import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GoogleAnalyticsService } from '../shared/service/google-analytics.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.css'
})
export class CookieConsentComponent {
  private readonly ga = inject(GoogleAnalyticsService);

  visible = signal(this.ga.getConsent() === null);

  accept(): void {
    this.ga.accept();
    this.visible.set(false);
  }

  reject(): void {
    this.ga.reject();
    this.visible.set(false);
  }
}
