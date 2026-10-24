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
      // SSO session settings. The token is only refreshed if the user was active
      // within sessionTimeout, so it is set high enough to always refresh while the
      // tab is open. AuthService sends the user to login once the session is gone.
      withAutoRefreshToken({
        onInactivityTimeout: 'none',
        sessionTimeout: 365 * 24 * 60 * 60 * 1000
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
