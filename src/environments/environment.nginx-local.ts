export const environment = {
  production: false,
  name: 'nginx-local',
  apiBaseUrl:  'http://keycloak.local:80/rest/api/v1/vocabulary',
  keycloakUrl: 'http://keycloak.local:80',
  keycloakUrlPattern: /^(?:http:\/\/keycloak\.local:80\/|\/)rest(\/.*)?$/i
};
