export interface Empresa {
  id?: number;
  razonSocial: string;
  nit: string;
  nombreComercial?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  telefono: string;
  email: string;
  representanteLegal: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'CANCELADA';
  tipoEmpresa?: string;
}

export interface EmpresaConteo {
  total: number;
  activas: number;
  inactivas: number;
  suspendidas: number;
  canceladas: number;
}

