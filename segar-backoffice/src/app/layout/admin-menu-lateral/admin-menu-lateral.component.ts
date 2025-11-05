import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthKeycloakService } from '../../auth/services/auth-keycloak.service';

@Component({
  selector: 'app-admin-menu-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-menu-lateral.component.html',
  styleUrl: './admin-menu-lateral.component.css'
})
export class AdminMenuLateralComponent implements OnInit {
  userProfile = {
    name: '',
    role: '',
    initials: ''
  };

  constructor(private authService: AuthKeycloakService) {}

  async ngOnInit() {
    await this.loadUserProfile();
  }

  private async loadUserProfile() {
    const userProfile = await this.authService.getUserProfile();
    if (userProfile) {
      this.userProfile.name = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userProfile.username || 'Super Admin';
      this.userProfile.role = 'Super Administrador';
      this.userProfile.initials = this.getInitials(this.userProfile.name);
    }
  }

  private getInitials(fullName: string): string {
    if (!fullName) return 'SA';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  async cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await this.authService.logout();
    }
  }
}

