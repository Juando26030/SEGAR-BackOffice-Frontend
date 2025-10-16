import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Verificar si requiere rol de admin
    if (route.data['requireAdmin'] && !authService.isAdmin()) {
      console.warn('⚠️ Usuario sin permisos de administrador');
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  console.log('❌ Usuario no autenticado, redirigiendo a login');
  router.navigate(['/login']);
  return false;
};

