import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Tenant {
  id?: number;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  estado: 'Activo' | 'Inactivo' | 'Prueba';
  usuariosActivos: number;
  fechaCreacion: string;
}

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.css']
})
export class TenantsListComponent implements OnInit {
  tenants: Tenant[] = [];
  tenantsFiltrados: Tenant[] = [];
  mostrarFormulario = false;
  editandoTenant = false;
  cargando = false;
  guardando = false;
  mensajeExito = '';
  mensajeError = '';
  searchTerm = '';
  filtroEstado = '';

  tenantForm: Tenant = {
    nombre: '',
    nit: '',
    email: '',
    telefono: '',
    plan: 'Professional',
    estado: 'Prueba',
    usuariosActivos: 0,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarTenants();
  }

  cargarTenants() {
    this.cargando = true;

    // Datos ficticios para demostración
    setTimeout(() => {
      this.tenants = [
        {
          id: 1,
          nombre: 'AlimentosCol S.A.',
          nit: '900123456-1',
          email: 'contacto@alimentoscol.com',
          telefono: '+57 300 1234567',
          plan: 'Enterprise',
          estado: 'Activo',
          usuariosActivos: 45,
          fechaCreacion: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'FarmaLat Internacional',
          nit: '900789012-2',
          email: 'info@farmalat.com',
          telefono: '+57 301 9876543',
          plan: 'Professional',
          estado: 'Activo',
          usuariosActivos: 28,
          fechaCreacion: '2024-02-20'
        },
        {
          id: 3,
          nombre: 'Cosmética Natural Ltda',
          nit: '900345678-3',
          email: 'ventas@cosmetica.com',
          telefono: '+57 320 5551234',
          plan: 'Professional',
          estado: 'Activo',
          usuariosActivos: 15,
          fechaCreacion: '2024-03-10'
        },
        {
          id: 4,
          nombre: 'Dispositivos Médicos S.A.',
          nit: '900456789-4',
          email: 'contacto@dispositivosmed.com',
          telefono: '+57 315 4567890',
          plan: 'Starter',
          estado: 'Prueba',
          usuariosActivos: 8,
          fechaCreacion: '2024-11-01'
        }
      ];

      this.tenantsFiltrados = [...this.tenants];
      this.cargando = false;
    }, 800);
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  guardarTenant() {
    this.guardando = true;

    setTimeout(() => {
      if (this.editandoTenant) {
        const index = this.tenants.findIndex(t => t.id === this.tenantForm.id);
        if (index !== -1) {
          this.tenants[index] = { ...this.tenantForm };
          this.mensajeExito = 'Tenant actualizado exitosamente';
        }
      } else {
        const newTenant = {
          ...this.tenantForm,
          id: this.tenants.length + 1,
          usuariosActivos: 0
        };
        this.tenants.push(newTenant);
        this.mensajeExito = 'Tenant creado exitosamente';
      }

      this.filtrarTenants();
      this.guardando = false;
      this.mostrarFormulario = false;
      this.resetForm();

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  editarTenant(tenant: Tenant) {
    this.tenantForm = { ...tenant };
    this.editandoTenant = true;
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarTenant(tenant: Tenant) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${tenant.nombre}?`)) {
      this.tenants = this.tenants.filter(t => t.id !== tenant.id);
      this.filtrarTenants();
      this.mensajeExito = 'Tenant eliminado exitosamente';

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.resetForm();
  }

  resetForm() {
    this.tenantForm = {
      nombre: '',
      nit: '',
      email: '',
      telefono: '',
      plan: 'Professional',
      estado: 'Prueba',
      usuariosActivos: 0,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    this.editandoTenant = false;
  }

  filtrarTenants() {
    let filtered = [...this.tenants];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.nombre.toLowerCase().includes(term) ||
        t.nit.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term)
      );
    }

    if (this.filtroEstado) {
      filtered = filtered.filter(t => t.estado === this.filtroEstado);
    }

    this.tenantsFiltrados = filtered;
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}

