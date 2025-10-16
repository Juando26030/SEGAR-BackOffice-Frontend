export const environment = {
  production: false,
  apiUrl: 'http://localhost:8090', // Mismo backend que el frontend
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'segar',
    clientId: 'segar-backoffice'
  }
};

