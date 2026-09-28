import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService
} from 'keycloak-angular';

import { environment } from '../environments/environment';

const hostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
 urlPattern: environment.keycloakUrlPattern
});

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: 'vocabulary',
      url: environment.keycloakUrl,
      clientId: 'vocabulary-rest-api'
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      redirectUri: window.location.origin + '/'
    },
    features: [
      // Never log out on inactivity: the session lifetime is governed by Keycloak's
      // SSO session settings. If the refresh token is no longer valid, keycloak-js
      // clears the tokens and emits AuthLogout, so the UI updates on its own.
      withAutoRefreshToken({
        onInactivityTimeout: 'none',
        sessionTimeout: 10 * 60 * 1000
      })
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [hostCondition]
      }
    ]
  });
