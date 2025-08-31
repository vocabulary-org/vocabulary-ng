import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { includeBearerTokenInterceptor } from 'keycloak-angular';

import { provideKeycloakAngular } from './keycloak.config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAngular(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))
  ]
};
