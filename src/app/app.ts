import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { GoogleAnalyticsService } from './shared/service/google-analytics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookieConsentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'vocabulary-ng';

  constructor() {
    inject(GoogleAnalyticsService).initializeIfConsented();
  }
}
