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

  ultimaActualizacion: Date = new Date();
  isRefreshing = false;

  // KPIs principales
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
      title: 'Ingresos Mensuales',
      value: '$24,500',
      change: '+12% vs mes anterior',
      changeType: 'increase',
      icon: '💰',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Trámites Totales',
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

  // Tenants recientes
  recentTenants = [
    {
      name: 'AlimentosCol S.A.',
      plan: 'Enterprise',
      users: 45,
      status: 'active',
      since: 'Hace 2 días'
    },
    {
      name: 'FarmaLat Internacional',
      plan: 'Professional',
      users: 28,
      status: 'active',
      since: 'Hace 5 días'
    },
    {
      name: 'Cosmética Natural',
      plan: 'Professional',
      users: 15,
      status: 'active',
      since: 'Hace 1 semana'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthKeycloakService
  ) {}

  ngOnInit() {
    console.log('Dashboard Super Admin cargado');
  }

  async refreshDashboard() {
    this.isRefreshing = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.ultimaActualizacion = new Date();
    this.isRefreshing = false;
  }

  getTenantStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'trial': 'bg-yellow-100 text-yellow-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  navigateToTenants() {
    this.router.navigate(['/admin/tenants']);
  }
}

