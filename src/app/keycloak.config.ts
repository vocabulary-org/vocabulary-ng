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
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1000
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
