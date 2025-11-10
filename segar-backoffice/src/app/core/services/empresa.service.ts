import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empresa, EmpresaConteo } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.backendUrl}/api/empresas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las empresas
   */
  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  /**
   * Obtiene una empresa por ID
   */
  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene una empresa por NIT
   */
  getByNit(nit: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/nit/${nit}`);
  }

  /**
   * Crea una nueva empresa
   */
  create(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  /**
   * Actualiza una empresa existente
   */
  update(id: number, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa);
  }

  /**
   * Elimina una empresa (soft delete - cambia estado a CANCELADA)
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene empresas por estado
   */
  getByEstado(estado: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/estado/${estado}`);
  }

  /**
   * Obtiene conteo de empresas por estado
   */
  getConteo(): Observable<EmpresaConteo> {
    return this.http.get<EmpresaConteo>(`${this.apiUrl}/count`);
  }
}

