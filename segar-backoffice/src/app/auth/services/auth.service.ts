import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak | undefined;
  private userProfile: any = null;

  constructor() {}

  async init(): Promise<boolean> {
    try {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });

      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        flow: 'standard'
      });

      if (authenticated && this.keycloak.tokenParsed) {
        await this.loadUserProfile();
      }

      return authenticated;
    } catch (error) {
      console.error('❌ Error inicializando Keycloak:', error);
      return false;
    }
  }

  async login(): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/dashboard'
      });
    }
  }

  async logout(): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
    }
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated ?? false;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  async loadUserProfile(): Promise<void> {
    if (this.keycloak && this.keycloak.authenticated) {
      try {
        this.userProfile = await this.keycloak.loadUserProfile();
        console.log('✅ Perfil de usuario cargado:', this.userProfile);
      } catch (error) {
        console.error('❌ Error cargando perfil:', error);
      }
    }
  }

  getUser(): any {
    if (!this.userProfile && this.keycloak?.tokenParsed) {
      return {
        username: this.keycloak.tokenParsed['preferred_username'],
        email: this.keycloak.tokenParsed['email'],
        name: this.keycloak.tokenParsed['name'],
        roles: this.keycloak.tokenParsed['realm_access']?.['roles'] || []
      };
    }
    return this.userProfile;
  }

  hasRole(role: string): boolean {
    if (!this.keycloak?.tokenParsed) return false;
    const roles = this.keycloak.tokenParsed['realm_access']?.['roles'] || [];
    return roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('admin') || this.hasRole('backoffice-admin');
  }

  async refreshToken(): Promise<boolean> {
    if (this.keycloak) {
      try {
        const refreshed = await this.keycloak.updateToken(30);
        return refreshed;
      } catch (error) {
        console.error('❌ Error renovando token:', error);
        return false;
      }
    }
    return false;
  }
}

