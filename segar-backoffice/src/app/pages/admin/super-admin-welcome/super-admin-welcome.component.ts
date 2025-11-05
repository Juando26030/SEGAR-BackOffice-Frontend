import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthKeycloakService } from '../../../auth/services/auth-keycloak.service';
import { NavigationGuardService } from '../../../core/services/navigation-guard.service';

@Component({
  selector: 'app-super-admin-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full">
        <!-- Card principal -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <!-- Icono y título -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full shadow-lg mb-6">
              <span class="text-5xl">👑</span>
            </div>
            <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
              ¡Hola Super Admin!
            </h1>
            <p class="text-xl text-gray-600">
              Bienvenido al panel de administración SaaS
            </p>
          </div>

          <!-- Información del usuario -->
          <div class="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-8">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {{ getUserInitial() }}
              </div>
              <div>
                <p class="text-sm text-gray-600">Usuario:</p>
                <p class="text-lg font-bold text-gray-900">{{ userName }}</p>
                <p class="text-sm text-gray-600">{{ userEmail }}</p>
              </div>
            </div>
          </div>

          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">🏢</div>
              <div class="text-2xl font-bold text-blue-600">12</div>
              <div class="text-xs text-gray-600">Tenants</div>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">👥</div>
              <div class="text-2xl font-bold text-green-600">245</div>
              <div class="text-xs text-gray-600">Usuarios</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">📋</div>
              <div class="text-2xl font-bold text-purple-600">1.2K</div>
              <div class="text-xs text-gray-600">Trámites</div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4 text-center">
              <div class="text-3xl mb-2">💰</div>
              <div class="text-2xl font-bold text-yellow-600">$24K</div>
              <div class="text-xs text-gray-600">MRR</div>
            </div>
          </div>

          <!-- Mensaje de bienvenida -->
          <div class="bg-primary-50 border-l-4 border-primary-600 p-4 rounded-r-lg mb-8">
            <p class="text-sm text-gray-700">
              <strong>✨ Acceso completo:</strong> Como Super Admin, tienes control total sobre la plataforma SEGAR.
              Puedes gestionar tenants, configurar planes, ver analíticas globales y administrar usuarios de todo el sistema.
            </p>
          </div>

          <!-- Acciones rápidas -->
          <div class="space-y-3">
            <button
              (click)="goToDashboard()"
              class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-lg hover:from-primary-700 hover:to-primary-800 transition shadow-lg font-medium flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Ir al Dashboard Completo</span>
            </button>

            <button
              (click)="logout()"
              class="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center space-x-2">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <!-- Footer -->
          <div class="mt-8 pt-8 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
              Sistema de Gestión de Registros Sanitarios
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Panel de Administración SaaS v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SuperAdminWelcomeComponent implements OnInit {
  userName: string = 'Super Admin';
  userEmail: string = '';

  constructor(
    private router: Router,
    private authService: AuthKeycloakService,
    private navigationGuard: NavigationGuardService
  ) {}

  async ngOnInit() {
    console.log('🔍 SuperAdminWelcomeComponent iniciando...');

    // Esperar a que Keycloak se inicialice completamente
    await this.waitForKeycloakInit();

    // Verificar autenticación
    const isAuthenticated = this.authService.isLoggedIn();
    console.log('🔍 Estado de autenticación:', isAuthenticated);

    if (!isAuthenticated) {
      console.warn('⚠️ Usuario no autenticado después de espera, redirigiendo al login');
      window.location.href = '/';
      return;
    }

    // Verificar que sea super-admin
    const userType = this.authService.getUserType();
    console.log('🔍 Tipo de usuario:', userType);

    if (userType !== 'SUPER_ADMIN') {
      console.warn('⚠️ Usuario no es super-admin, redirigiendo');
      this.router.navigate(['/unauthorized']);
      return;
    }

    // Prevenir navegación hacia atrás después de logout
    this.navigationGuard.preventBackNavigation();

    console.log('✅ Super Admin accediendo a página de bienvenida');
    console.log('👤 Roles del usuario:', this.authService.getUserRoles());

    // Cargar información del usuario
    await this.loadUserInfo();
  }

  /**
   * Espera a que Keycloak se inicialice completamente
   * Intenta varias veces con un pequeño delay
   */
  private async waitForKeycloakInit(): Promise<void> {
    console.log('⏳ Esperando inicialización de Keycloak...');

    for (let i = 0; i < 10; i++) {
      if (this.authService.isLoggedIn()) {
        console.log('✅ Keycloak inicializado correctamente');
        return;
      }

      console.log(`   Intento ${i + 1}/10...`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.warn('⚠️ Keycloak no se inicializó en el tiempo esperado');
  }

  async loadUserInfo() {
    try {
      const userProfile = await this.authService.getUserProfile();
      if (userProfile) {
        this.userName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Super Admin';
        this.userEmail = userProfile.email || '';
        console.log('✅ Información de usuario cargada:', { userName: this.userName, userEmail: this.userEmail });
      } else {
        // Fallback a información del token
        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          this.userName = userInfo.preferred_username || userInfo.name || 'Super Admin';
          this.userEmail = userInfo.email || '';
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cargar perfil completo, usando datos del token');
      const userInfo = this.authService.getUserInfo();
      if (userInfo) {
        this.userName = userInfo.preferred_username || userInfo.name || 'Super Admin';
        this.userEmail = userInfo.email || '';
      }
    }
  }

  getUserInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  async logout() {
    await this.authService.logout();
  }
}

