import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLEADO';

@Injectable({
  providedIn: 'root'
})
export class AuthKeycloakService {

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getUserProfile() {
    try {
      // Primero verificar si está logueado
      if (!this.keycloakService.isLoggedIn()) {
        console.log('Usuario no está logueado');
        return null;
      }

      return await this.keycloakService.loadUserProfile();
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  /**
   * Obtiene los roles del usuario
   */
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    const roles = this.getUserRoles();
    console.log('🔍 Verificando rol:', role, 'en roles del usuario:', roles);
    const hasIt = roles.some(r => r.toUpperCase() === role || r.toLowerCase() === role.toLowerCase());
    console.log('   Resultado:', hasIt);
    return hasIt;
  }

  /**
   * Obtiene el tipo de usuario basado en sus roles
   * Retorna el rol con mayor privilegio
   */
  getUserType(): UserRole | null {
    console.log('🔍 Obteniendo tipo de usuario...');
    console.log('   Roles disponibles:', this.getUserRoles());

    // Verificar super-admin (puede venir como 'super-admin' o 'SUPER_ADMIN')
    if (this.hasRole('SUPER_ADMIN') || this.getUserRoles().some(r => r.toLowerCase() === 'super-admin')) {
      console.log('✅ Usuario identificado como SUPER_ADMIN');
      return 'SUPER_ADMIN';
    }
    if (this.hasRole('ADMIN')) {
      console.log('✅ Usuario identificado como ADMIN');
      return 'ADMIN';
    }
    if (this.hasRole('EMPLEADO')) {
      console.log('✅ Usuario identificado como EMPLEADO');
      return 'EMPLEADO';
    }

    console.warn('⚠️ Usuario sin rol válido');
    return null;
  }

  /**
   * Redirige al usuario según su rol
   * - SUPER_ADMIN → Backoffice (gestión de tenants)
   * - ADMIN/EMPLEADO → Frontend SEGAR (gestión de trámites)
   */
  async redirectByRole(): Promise<void> {
    if (!this.isLoggedIn()) {
      console.warn('⚠️ Usuario no autenticado');
      return;
    }

    const userType = this.getUserType();
    console.log('🔍 Tipo de usuario detectado:', userType);

    switch (userType) {
      case 'SUPER_ADMIN':
        // Redirigir al panel de bienvenida del super admin
        console.log('✅ Redirigiendo super-admin a /admin/welcome');
        // Usar router.navigate en lugar de window.location para mantener estado
        await this.router.navigate(['/admin/welcome'], { replaceUrl: true });
        break;

      case 'ADMIN':
      case 'EMPLEADO':
        // Redirigir al frontend SEGAR
        console.log('✅ Redirigiendo admin/empleado al frontend SEGAR');
        window.location.href = 'http://localhost:4200';
        break;

      default:
        console.error('❌ Usuario sin rol válido:', userType);
        await this.router.navigate(['/unauthorized']);
    }
  }

  /**
   * Inicia el proceso de login
   */
  async login(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  /**
   * Cierra la sesión completamente
   * Redirige directamente al login del frontend
   */
  async logout(): Promise<void> {
    console.log('🚪 Cerrando sesión...');

    // Simplemente redirigir al login del frontend
    // El login del frontend se encargará de cerrar la sesión de Keycloak
    window.location.href = 'http://localhost:4200/auth/login';
  }

  /**
   * Obtiene el token de acceso
   */
  getToken(): string {
    try {
      return this.keycloakService.getKeycloakInstance().token || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Obtiene información del usuario desde el token
   */
  getUserInfo(): any {
    try {
      return this.keycloakService.getKeycloakInstance().tokenParsed;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtiene el username del usuario autenticado
   */
  getUsername(): string {
    return this.keycloakService.getUsername();
  }
}

