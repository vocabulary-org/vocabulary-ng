export const environment = {
  production: false,
  name: 'local-nginx-ssl',
  apiBaseUrl:  'http://keycloak.local:443/rest/api/v1/vocabulary',
  keycloakUrl: 'http://keycloak.local:443',
  keycloakUrlPattern: /^(?:http:\/\/keycloak\.local:443\/|\/)rest(\/.*)?$/i
};
