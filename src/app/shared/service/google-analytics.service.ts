import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local-storage.service';

const CONSENT_KEY = 'analytics_consent';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);

  private get id(): string | undefined {
    return (environment as any).googleAnalyticsId;
  }

  getConsent(): 'accepted' | 'rejected' | null {
    return this.localStorage.getItem(CONSENT_KEY);
  }

  accept(): void {
    this.localStorage.setItem(CONSENT_KEY, 'accepted');
    this.load();
  }

  reject(): void {
    this.localStorage.setItem(CONSENT_KEY, 'rejected');
  }

  initializeIfConsented(): void {
    if (this.getConsent() === 'accepted') {
      this.load();
    }
  }

  private load(): void {
    const id = this.id;
    if (!id) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function () {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', id);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        (window as any).gtag('config', id, {
          page_path: (event as NavigationEnd).urlAfterRedirects
        });
      });
  }
}
