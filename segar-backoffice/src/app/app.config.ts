import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { AuthKeycloakService } from './auth/services/auth-keycloak.service';

// Registrar locale español
registerLocaleData(localeEs, 'es');

/**
 * Función de inicialización de Keycloak
 * Configurado para mantener la sesión después del login
 */
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'segar',
        clientId: 'segar-backoffice'
      },
      initOptions: {
        onLoad: 'check-sso', // Verificar SSO pero no forzar login
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        responseMode: 'fragment', // Usar fragment para el callback
        flow: 'standard',
        pkceMethod: 'S256' // Agregar PKCE para mayor seguridad
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/']
    })
    .then((authenticated) => {
      console.log('🔐 Keycloak inicializado. Autenticado:', authenticated);

      // Si está autenticado después del callback, redirigir al welcome
      if (authenticated) {
        const currentUrl = window.location.href;
        console.log('🔍 URL actual:', currentUrl);

        // Si estamos en el callback o en login y está autenticado, redirigir
        if (currentUrl.includes('/auth/callback') || currentUrl.includes('/login')) {
          console.log('✅ Autenticado después del callback, redirigiendo...');
          window.location.href = '/admin/welcome';
        }
      }

      return authenticated;
    })
    .catch((error) => {
      console.error('❌ Error al inicializar Keycloak:', error);
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
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
};
