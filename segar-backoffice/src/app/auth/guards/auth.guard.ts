import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthKeycloakService } from '../services/auth-keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthKeycloakService);
  const router = inject(Router);

  console.log('🔒 AuthGuard verificando acceso a:', state.url);

  if (authService.isLoggedIn()) {
    console.log('✅ Usuario autenticado');

    // Verificar si requiere rol de super admin del backoffice
    if (route.data['requireSuperAdmin']) {
      const hasSuperAdminRole = authService.hasBackofficeRole('super.admin');
      console.log('🔍 Verificando rol super.admin del cliente segar-backoffice:', hasSuperAdminRole);

      if (!hasSuperAdminRole) {
        console.warn('⚠️ Usuario no tiene rol super.admin en segar-backoffice');
        console.log('🔄 Redirigiendo a /unauthorized');
        router.navigate(['/unauthorized']);
        return false;
      }

      console.log('✅ Usuario tiene rol super.admin - Acceso concedido');
    }

    return true;
  }

  console.log('❌ Usuario no autenticado, redirigiendo a login');
  router.navigate(['/login']);
  return false;
};

