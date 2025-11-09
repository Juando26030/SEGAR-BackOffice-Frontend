import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Gestión de Tenants</h1>

      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-800">
              🚧 Esta sección está en desarrollo. Aquí podrás gestionar los clientes (tenants) del sistema.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🏢</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Tenants</h2>
          <p class="text-gray-600 mb-6">Próximamente: CRUD completo de clientes/tenants</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-2xl mb-2">➕</div>
              <p class="text-sm font-medium text-purple-900">Crear Tenants</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl mb-2">✏️</div>
              <p class="text-sm font-medium text-blue-900">Editar Tenants</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <div class="text-2xl mb-2">🗑️</div>
              <p class="text-sm font-medium text-red-900">Eliminar Tenants</p>
            </div>
          </div>

          <button
            (click)="goBack()"
            class="mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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

