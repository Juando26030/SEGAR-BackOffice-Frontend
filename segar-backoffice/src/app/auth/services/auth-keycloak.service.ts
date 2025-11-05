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
    return roles.some(r => r.toUpperCase() === role);
  }

  /**
   * Obtiene el tipo de usuario basado en sus roles
   * Retorna el rol con mayor privilegio
   */
  getUserType(): UserRole | null {
    if (this.hasRole('SUPER_ADMIN')) {
      return 'SUPER_ADMIN';
    }
    if (this.hasRole('ADMIN')) {
      return 'ADMIN';
    }
    if (this.hasRole('EMPLEADO')) {
      return 'EMPLEADO';
    }
    return null;
  }

  /**
   * Redirige al usuario según su rol
   * - SUPER_ADMIN → Backoffice (gestión de tenants)
   * - ADMIN/EMPLEADO → Frontend SEGAR (gestión de trámites)
   */
  async redirectByRole(): Promise<void> {
    if (!this.isLoggedIn()) {
      console.warn('Usuario no autenticado');
      return;
    }

    const userType = this.getUserType();
    console.log('Tipo de usuario detectado:', userType);

    switch (userType) {
      case 'SUPER_ADMIN':
        // Redirigir al panel de administración SaaS (backoffice)
        window.location.href = '/admin/dashboard';
        break;

      case 'ADMIN':
      case 'EMPLEADO':
        // Redirigir al frontend SEGAR
        window.location.href = 'http://localhost:4200';
        break;

      default:
        console.error('Usuario sin rol válido');
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
   * Cierra la sesión
   */
  async logout(): Promise<void> {
    await this.keycloakService.logout(window.location.origin);
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

