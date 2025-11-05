import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthKeycloakService } from '../services/auth-keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthKeycloakService);
  const router = inject(Router);

  console.log('🔒 AuthGuard verificando acceso...');

  if (authService.isLoggedIn()) {
    console.log('✅ Usuario autenticado');

    // Verificar si requiere rol de admin/super-admin
    if (route.data['requireAdmin']) {
      const userType = authService.getUserType();
      console.log('🔍 Verificando permisos de admin. Tipo de usuario:', userType);

      if (userType !== 'SUPER_ADMIN') {
        console.warn('⚠️ Usuario sin permisos de administrador');
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }

  console.log('❌ Usuario no autenticado, redirigiendo a landing');
  window.location.href = '/';
  return false;
};

