export const environment = {
  production: false,
  name: 'hetzner-nginx-ssl',

  apiBaseUrl:  'https://api.myvocabulary.net/api/v1/vocabulary',
  keycloakUrl: 'https://auth.myvocabulary.net',

  keycloakUrlPattern: /^(https:\/\/api\.myvocabulary\.net)(\/.*)?$/i
};
