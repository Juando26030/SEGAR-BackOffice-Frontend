import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { AuthKeycloakService } from './auth/services/auth-keycloak.service';

/**
 * Función de inicialización de Keycloak
 * NO inicia sesión automáticamente - permite ver la landing page primero
 */
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',  // Usar localhost para pruebas locales
        realm: 'segar',
        clientId: 'segar-backoffice'
      },
      initOptions: {
        onLoad: undefined, // NO cargar sesión automáticamente
        checkLoginIframe: false,
        flow: 'standard'
      },
      bearerExcludedUrls: ['/assets', '/']
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(KeycloakAngularModule),
    KeycloakService,
    AuthKeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
};
