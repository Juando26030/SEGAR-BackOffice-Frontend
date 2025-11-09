import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthKeycloakService } from '../services/auth-keycloak.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Iniciando sesión...</h2>
        <p class="text-gray-600">Redirigiendo según tu rol</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: AuthKeycloakService) {}

  async ngOnInit() {
    console.log('🔄 AuthCallbackComponent - Procesando callback de autenticación...');
    console.log('🔍 URL actual:', window.location.href);

    // El callback ya debería haber sido procesado por Keycloak en app.config.ts
    // Solo necesitamos verificar y redirigir
    await this.handleCallback();
  }

  private async handleCallback(): Promise<void> {
    console.log('⏳ Esperando que Keycloak procese el callback...');

    // Intentar hasta 30 veces (6 segundos)
    for (let i = 0; i < 30; i++) {
      if (this.authService.isLoggedIn()) {
        console.log('✅ Usuario autenticado exitosamente en callback');
        console.log('🔍 Todos los roles del usuario:', this.authService.getUserRoles());

        // Esperar un momento para asegurar que el token está completamente cargado
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verificar roles del cliente segar-backoffice
        const backofficeRoles = this.authService.getBackofficeRoles();
        console.log('🔍 Roles del cliente segar-backoffice:', backofficeRoles);

        // Verificar si tiene el rol super.admin
        const hasSuperAdminRole = this.authService.hasBackofficeRole('super.admin');
        console.log('🔍 ¿Tiene rol super.admin?', hasSuperAdminRole);

        if (hasSuperAdminRole) {
          console.log('✅ Usuario autorizado como Super Admin');
          console.log('🔄 Redirigiendo a /admin/welcome');
          window.location.href = '/admin/welcome';
        } else {
          console.warn('⚠️ Usuario no tiene rol super.admin en segar-backoffice');
          console.log('🔄 Redirigiendo a página no autorizada');
          window.location.href = '/unauthorized';
        }
        return;
      }

      if (i % 5 === 0) {
        console.log(`   Esperando autenticación... Intento ${i + 1}/30`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.error('❌ Error: Timeout esperando autenticación');
    console.error('   Usuario no autenticado después del callback');
    console.error('   Redirigiendo al login');
    window.location.href = '/login';
  }
}

