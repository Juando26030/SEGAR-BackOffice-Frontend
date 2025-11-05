import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthKeycloakService } from '../../../auth/services/auth-keycloak.service';

interface DashboardStat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
  gradient: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  userName: string = '';
  userEmail: string = '';

  stats: DashboardStat[] = [
    {
      title: 'Tenants Activos',
      value: 12,
      change: '+2 este mes',
      changeType: 'increase',
      icon: '🏢',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Usuarios Totales',
      value: 245,
      change: '+18 esta semana',
      changeType: 'increase',
      icon: '👥',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Trámites en el Sistema',
      value: '1.2K',
      change: '+156 este mes',
      changeType: 'increase',
      icon: '📋',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Ingresos Recurrentes',
      value: '$24.5K',
      change: '+12% vs mes anterior',
      changeType: 'increase',
      icon: '💰',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  ];

  recentTenants = [
    {
      name: 'Farmacéutica ABC',
      nit: '900123456-1',
      plan: 'Profesional',
      status: 'Activo',
      users: 15,
      createdAt: '2025-01-05'
    },
    {
      name: 'Laboratorios XYZ',
      nit: '900789012-2',
      plan: 'Enterprise',
      status: 'Activo',
      users: 32,
      createdAt: '2025-01-03'
    },
    {
      name: 'Cosmética Natural Ltda',
      nit: '900345678-3',
      plan: 'Starter',
      status: 'Prueba',
      users: 5,
      createdAt: '2025-01-02'
    }
  ];

  constructor(
    private authService: AuthKeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    // No necesitamos verificar rol aquí porque el login ya lo hizo
    console.log('✅ Super Admin accediendo al dashboard');

    // Cargar información del usuario
    this.loadUserInfo();
  }

  async loadUserInfo() {
    const userProfile = await this.authService.getUserProfile();
    if (userProfile) {
      this.userName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
      this.userEmail = userProfile.email || '';
    }
  }

  async logout() {
    await this.authService.logout();
  }

  navigateToTenants() {
    this.router.navigate(['/admin/tenants']);
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }

  navigateToSettings() {
    this.router.navigate(['/admin/settings']);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'prueba':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspendido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPlanColor(plan: string): string {
    switch (plan.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'profesional':
        return 'bg-blue-100 text-blue-800';
      case 'starter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

