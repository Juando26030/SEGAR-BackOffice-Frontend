import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthKeycloakService } from '../../auth/services/auth-keycloak.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  sessionExpiredMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthKeycloakService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    console.log('🔐 =================================');
    console.log('🔐 LOGIN SUPER ADMIN - BACKOFFICE');
    console.log('🔐 =================================');

    // Verificar si hay mensaje de sesión expirada
    this.checkSessionExpired();

    // Verificar si ya está autenticado
    if (this.authService.isLoggedIn()) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      this.router.navigate(['/admin/welcome'], { replaceUrl: true });
    }
  }

  /**
   * Verifica si la sesión expiró y muestra el mensaje al usuario
   */
  private checkSessionExpired(): void {
    const sessionExpired = sessionStorage.getItem('session_expired');
    const reason = sessionStorage.getItem('session_expired_reason');

    if (sessionExpired === 'true' && reason) {
      this.sessionExpiredMessage = reason;

      // Limpiar los mensajes del sessionStorage
      sessionStorage.removeItem('session_expired');
      sessionStorage.removeItem('session_expired_reason');

      // Limpiar el mensaje después de 10 segundos
      setTimeout(() => {
        this.sessionExpiredMessage = '';
      }, 10000);
    }
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { username, password } = this.loginForm.value;

        console.log('🔐 Iniciando autenticación para:', username);

        // Validar credenciales directamente con Keycloak
        const success = await this.loginWithCredentials(username, password);

        if (success) {
          console.log('✅ Autenticación exitosa');
          // Redirigir al dashboard
          await this.router.navigate(['/admin/welcome'], { replaceUrl: true });
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          console.error('❌ Credenciales inválidas');
        }

      } catch (error) {
        console.error('❌ Error en autenticación:', error);
        this.errorMessage = 'Error de conexión. Intenta nuevamente.';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Valida credenciales directamente con Keycloak usando Resource Owner Password Credentials Grant
   */
  private async loginWithCredentials(username: string, password: string): Promise<boolean> {
    try {
      console.log('📡 Haciendo petición de autenticación a Keycloak...');

      const response = await fetch(
        `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: environment.keycloak.clientId,
            username: username,
            password: password,
            scope: 'openid profile email'
          })
        }
      );

      if (response.ok) {
        const tokenData = await response.json();
        console.log('✅ Token obtenido exitosamente');

        // Parsear el token para verificar roles
        const tokenParsed = this.parseJwt(tokenData.access_token);

        console.log('🔍 TOKEN COMPLETO resource_access:', tokenParsed?.resource_access);

        const backofficeRoles = tokenParsed?.resource_access?.['segar-backoffice']?.roles || [];

        console.log('🔍 Roles del usuario en segar-backoffice:', backofficeRoles);
        console.log('🔍 Cantidad de roles:', backofficeRoles.length);

        // Mostrar cada rol
        backofficeRoles.forEach((role: string, index: number) => {
          console.log(`   🔍 Rol [${index}]: "${role}"`);
        });

        // Verificar que el usuario tenga el rol super.admin (con múltiples variantes)
        const hasSuperAdminRole = backofficeRoles.some((role: string) => {
          const roleNormalized = role.toLowerCase().trim();
          const isMatch =
            roleNormalized === 'super.admin' ||
            roleNormalized === 'super-admin' ||
            roleNormalized === 'superadmin' ||
            roleNormalized === 'super_admin';

          if (isMatch) {
            console.log(`✅ MATCH: "${role}" es válido como rol de super admin`);
          }

          return isMatch;
        });

        if (!hasSuperAdminRole) {
          console.error('❌ Usuario no tiene rol super.admin');
          console.error('   Roles disponibles:', backofficeRoles);
          console.error('   Se esperaba uno de: super.admin, super-admin, SUPER_ADMIN, etc.');
          this.errorMessage = 'Acceso denegado. Solo Super Administradores pueden acceder.';
          return false;
        }

        console.log('✅ Usuario SUPER_ADMIN verificado');

        // Configurar el token en la instancia de Keycloak
        const keycloakInstance = this.authService.getKeycloakInstance();
        (keycloakInstance as any).authenticated = true;
        (keycloakInstance as any).token = tokenData.access_token;
        (keycloakInstance as any).refreshToken = tokenData.refresh_token;
        (keycloakInstance as any).tokenParsed = tokenParsed;

        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error en autenticación:', response.status, errorData);

        if (response.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (errorData.error === 'invalid_grant') {
          this.errorMessage = 'Credenciales inválidas';
        } else {
          this.errorMessage = 'Error de autenticación. Intenta nuevamente.';
        }

        return false;
      }
    } catch (error) {
      console.error('❌ Error en loginWithCredentials:', error);
      this.errorMessage = 'Error de conexión con el servidor de autenticación';
      return false;
    }
  }

  /**
   * Parsea un JWT token
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }


  backToLanding(): void {
    this.router.navigate(['/']);
  }
}
