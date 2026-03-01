export const environment = {
  production: false,
  name: 'local-nginx-ssl',
  apiBaseUrl:  'https://keycloak.local/rest/api/v1/vocabulary',
  keycloakUrl: 'https://keycloak.local',
  keycloakUrlPattern: /^(?:https:\/\/keycloak\.local\/|\/)rest(\/.*)?$/i,
  turnstileSiteKey: '0x4AAAAAACkGX7dR6zDQX1Gh'
};
