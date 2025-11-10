import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-global',
  imports: [CommonModule, FormsModule],
  templateUrl: './busqueda-global.component.html',
  styleUrl: './busqueda-global.component.css'
})
export class BusquedaGlobalComponent {
  searchQuery = '';
  showFilters = false;
  isLoading = false;
  hasSearched = false;
  mostrarMensajeSinResultados = false;
  mostrarMensajeBusquedaMinima = false;

  // Filtros
  selectedType = 'all';
  selectedStatus = 'all';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchQuery.length < 2) {
      this.mostrarMensajeBusquedaMinima = true;
      this.mostrarMensajeSinResultados = false;
      this.hasSearched = false;
      return;
    }

    this.hasSearched = true;
    this.isLoading = true;
    this.mostrarMensajeBusquedaMinima = false;

    // Simular búsqueda
    setTimeout(() => {
      this.isLoading = false;
      this.mostrarMensajeSinResultados = true;
    }, 1000);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearSearch() {
    this.searchQuery = '';
    this.hasSearched = false;
    this.mostrarMensajeSinResultados = false;
    this.mostrarMensajeBusquedaMinima = false;
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}
