import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthKeycloakService } from '../services/auth-keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthKeycloakService);

  // Solo agregar token si el usuario está autenticado
  if (authService.isLoggedIn()) {
    const token = authService.getToken();

    if (token) {
      console.log('🔐 Agregando token Bearer a la petición:', req.url);
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    }
  }

  console.log('⚠️ Petición sin token de autenticación:', req.url);
  return next(req);
};

