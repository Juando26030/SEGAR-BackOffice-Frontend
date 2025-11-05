import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Tenants</h1>
          <p class="text-gray-600">Administra las empresas que usan la plataforma SEGAR</p>
        </div>

        <!-- Contenido próximamente -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="text-6xl mb-4">🏢</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Tenants</h2>
          <p class="text-gray-600 mb-6">Panel de administración de empresas próximamente</p>
          <button (click)="goBack()" class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  `
})
export class TenantsListComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}

