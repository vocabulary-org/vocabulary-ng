export const environment = {
  production: false,
  name: 'local-nginx',
  apiBaseUrl:  'http://keycloak.local:80/rest/api/v1/vocabulary',
  keycloakUrl: 'http://keycloak.local:80',
  keycloakUrlPattern: /^(?:http:\/\/keycloak\.local:80\/|\/)rest(\/.*)?$/i,
  turnstileSiteKey: '',
  captchaEnabled: false
};
