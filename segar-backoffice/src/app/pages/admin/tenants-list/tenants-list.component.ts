import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';

interface Tenant {
  id?: number;
  razonSocial: string;
  nit: string;
  email: string;
  telefono: string;
  representanteLegal: string;
  direccion?: string;
  ciudad?: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA';
}

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [EmpresaService],
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
    razonSocial: '',
    nit: '',
    email: '',
    telefono: '',
    representanteLegal: '',
    direccion: '',
    ciudad: '',
    estado: 'ACTIVA'
  };

  constructor(
    private router: Router,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.cargarTenants();
  }

  cargarTenants() {
    this.cargando = true;

    this.empresaService.getAll().subscribe({
      next: (empresas: Empresa[]) => {
        // Mapear Empresa a Tenant para compatibilidad con el template
        this.tenants = empresas.map(empresa => ({
          id: empresa.id,
          razonSocial: empresa.razonSocial,
          nit: empresa.nit,
          email: empresa.email,
          telefono: empresa.telefono,
          representanteLegal: empresa.representanteLegal,
          direccion: empresa.direccion,
          ciudad: empresa.ciudad,
          estado: empresa.estado as 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA'
        }));
        this.tenantsFiltrados = [...this.tenants];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.mensajeError = 'Error al cargar las empresas. Por favor, intenta nuevamente.';
        this.cargando = false;

        setTimeout(() => {
          this.mensajeError = '';
        }, 5000);
      }
    });
  }


  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  guardarTenant() {
    this.guardando = true;

    const empresaData: Empresa = {
      id: this.tenantForm.id,
      razonSocial: this.tenantForm.razonSocial,
      nit: this.tenantForm.nit,
      email: this.tenantForm.email,
      telefono: this.tenantForm.telefono,
      representanteLegal: this.tenantForm.representanteLegal,
      direccion: this.tenantForm.direccion || '',
      ciudad: this.tenantForm.ciudad || '',
      estado: this.tenantForm.estado,
      nombreComercial: '',
      pais: 'Colombia',
      tipoEmpresa: 'CLIENTE'
    };

    if (this.editandoTenant && this.tenantForm.id) {
      // Actualizar empresa existente
      this.empresaService.update(this.tenantForm.id, empresaData).subscribe({
        next: (empresaActualizada) => {
          const index = this.tenants.findIndex(t => t.id === empresaActualizada.id);
          if (index !== -1) {
            this.tenants[index] = {
              id: empresaActualizada.id,
              razonSocial: empresaActualizada.razonSocial,
              nit: empresaActualizada.nit,
              email: empresaActualizada.email,
              telefono: empresaActualizada.telefono,
              representanteLegal: empresaActualizada.representanteLegal,
              direccion: empresaActualizada.direccion,
              ciudad: empresaActualizada.ciudad,
              estado: empresaActualizada.estado as 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA'
            };
          }

          this.mensajeExito = 'Empresa actualizada exitosamente';
          this.filtrarTenants();
          this.guardando = false;
          this.mostrarFormulario = false;
          this.resetForm();

          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar empresa:', error);
          this.mensajeError = error.error?.error || 'Error al actualizar la empresa';
          this.guardando = false;

          setTimeout(() => {
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
      // Crear nueva empresa
      this.empresaService.create(empresaData).subscribe({
        next: (nuevaEmpresa) => {
          this.tenants.push({
            id: nuevaEmpresa.id,
            razonSocial: nuevaEmpresa.razonSocial,
            nit: nuevaEmpresa.nit,
            email: nuevaEmpresa.email,
            telefono: nuevaEmpresa.telefono,
            representanteLegal: nuevaEmpresa.representanteLegal,
            direccion: nuevaEmpresa.direccion,
            ciudad: nuevaEmpresa.ciudad,
            estado: nuevaEmpresa.estado as 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA'
          });

          this.mensajeExito = 'Empresa creada exitosamente';
          this.filtrarTenants();
          this.guardando = false;
          this.mostrarFormulario = false;
          this.resetForm();

          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error al crear empresa:', error);
          this.mensajeError = error.error?.error || 'Error al crear la empresa';
          this.guardando = false;

          setTimeout(() => {
            this.mensajeError = '';
          }, 5000);
        }
      });
    }
  }

  editarTenant(tenant: Tenant) {
    this.tenantForm = { ...tenant };
    this.editandoTenant = true;
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarTenant(tenant: Tenant) {
    if (!tenant.id) return;

    if (confirm(`¿Estás seguro de que deseas eliminar a ${tenant.razonSocial}?`)) {
      this.empresaService.delete(tenant.id).subscribe({
        next: () => {
          this.tenants = this.tenants.filter(t => t.id !== tenant.id);
          this.filtrarTenants();
          this.mensajeExito = 'Empresa eliminada exitosamente';

          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error al eliminar empresa:', error);
          this.mensajeError = error.error?.error || 'Error al eliminar la empresa';

          setTimeout(() => {
            this.mensajeError = '';
          }, 5000);
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.resetForm();
  }

  resetForm() {
    this.tenantForm = {
      razonSocial: '',
      nit: '',
      email: '',
      telefono: '',
      representanteLegal: '',
      direccion: '',
      ciudad: '',
      estado: 'ACTIVA'
    };
    this.editandoTenant = false;
  }

  filtrarTenants() {
    let filtered = [...this.tenants];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.razonSocial.toLowerCase().includes(term) ||
        t.nit.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term) ||
        (t.representanteLegal && t.representanteLegal.toLowerCase().includes(term))
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

