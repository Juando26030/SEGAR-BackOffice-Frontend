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
    console.log('🔄 Procesando callback de autenticación...');

    // Esperar un momento para que Keycloak procese el token
    setTimeout(async () => {
      if (this.authService.isLoggedIn()) {
        console.log('✅ Usuario autenticado exitosamente');
        await this.authService.redirectByRole();
      } else {
        console.error('❌ Error: Usuario no autenticado después del callback');
        window.location.href = '/';
      }
    }, 1000);
  }
}

