# SEGAR BackOffice Frontend

Panel de administración para el sistema SEGAR (Sistema de Gestión Electrónica de Asuntos Regulatorios).

## 🎯 Descripción

Este es el frontend del BackOffice de SEGAR, diseñado exclusivamente para administradores de SaaS que gestionan el sistema. Incluye:

- **Landing Page profesional**: Presenta todas las características y beneficios de SEGAR
- **Sistema de autenticación**: Integrado con Keycloak para gestión segura de identidades
- **Dashboard de administración**: Panel de control para gestionar usuarios, empresas y configuraciones del sistema

## 🚀 Características

### Landing Page
- Hero section con llamadas a la acción
- Sección de beneficios y funcionalidades
- Casos de uso por industria
- Tabla comparativa con competidores
- Testimonios de usuarios
- Formulario de contacto
- Diseño responsive y moderno

### Autenticación
- Login integrado con Keycloak
- Validación de roles de administrador
- Protección de rutas con guards
- Manejo de sesiones seguras

### Dashboard (en desarrollo)
- Panel principal de administración
- Gestión de usuarios
- Gestión de empresas
- Reportes y análisis
- Configuración del sistema

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (v19)
- Keycloak Server (v23.0.0) corriendo en `http://localhost:8080`
- Backend de SEGAR corriendo en `http://localhost:8090`

## 🔧 Instalación

1. **Clonar el repositorio** (si aún no lo has hecho)

2. **Navegar a la carpeta del proyecto**
```bash
cd SEGAR-BackOffice-Frontend/segar-backoffice
```

3. **Instalar dependencias**
```bash
npm install
```

## ⚙️ Configuración

### 1. Configurar Keycloak

Asegúrate de tener Keycloak configurado con:
- Realm: `segar`
- Client ID: `segar-backoffice`
- Client Type: `public`
- Valid redirect URIs: `http://localhost:4201/*`
- Web origins: `http://localhost:4201`

### 2. Configurar variables de entorno

Edita el archivo `src/environments/environment.ts` si necesitas cambiar las URLs:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8090', // Backend
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'segar',
    clientId: 'segar-backoffice'
  }
};
```

## 🏃 Ejecutar la Aplicación

### Modo desarrollo

```bash
npm start
```

O especifica un puerto diferente (recomendado para evitar conflictos con el frontend principal):

```bash
ng serve --port 4201
```

La aplicación estará disponible en: `http://localhost:4201`

### Build para producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/segar-backoffice/`

## 📁 Estructura del Proyecto

```
segar-backoffice/
├── src/
│   ├── app/
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── guards/              # Guards de rutas
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── services/            # Servicios de auth
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── landing/             # Landing page
│   │   │   ├── login/               # Página de login
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   └── unauthorized/        # Página de no autorizado
│   │   ├── app.routes.ts            # Configuración de rutas
│   │   └── app.config.ts            # Configuración de la app
│   ├── environments/                # Variables de entorno
│   └── styles.css                   # Estilos globales
└── tailwind.config.js               # Configuración de Tailwind
```

## 🎨 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **Tailwind CSS**: Framework de estilos
- **Keycloak**: Gestión de identidades y autenticación
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva

## 🔐 Autenticación y Seguridad

- **Keycloak**: Sistema de autenticación SSO
- **JWT Tokens**: Autenticación basada en tokens
- **HTTP Interceptors**: Inyección automática de tokens en peticiones
- **Route Guards**: Protección de rutas según roles
- **Roles requeridos**: `admin` o `backoffice-admin`

## 🌐 Endpoints del Backend

El frontend se conecta al backend en `http://localhost:8090` (mismo backend que el frontend principal).

Endpoints principales:
- `GET /api/users` - Gestión de usuarios
- `GET /api/companies` - Gestión de empresas
- `GET /api/reports` - Reportes y estadísticas

## 📝 Flujo de Usuario

1. **Landing Page** (`/`): Usuario llega a la página principal
2. **Login** (`/login`): Click en "Iniciar Sesión" → Redirige a Keycloak
3. **Autenticación**: Keycloak valida credenciales
4. **Validación de rol**: Sistema verifica que el usuario tenga rol de admin
5. **Dashboard** (`/dashboard`): Acceso al panel de administración
6. **Unauthorized** (`/unauthorized`): Si el usuario no tiene permisos

## 🐛 Solución de Problemas

### Error: Cannot connect to Keycloak
- Verifica que Keycloak esté corriendo en `http://localhost:8080`
- Verifica que el realm `segar` exista
- Verifica que el client `segar-backoffice` esté configurado

### Error: Backend API not responding
- Verifica que el backend esté corriendo en `http://localhost:8090`
- Verifica la configuración CORS en el backend

### Error: Acceso denegado después de login
- Verifica que el usuario tenga el rol `admin` o `backoffice-admin` en Keycloak
- Revisa los logs del navegador para más detalles

## 🔄 Diferencias con el Frontend Principal

| Característica | Frontend Principal | BackOffice |
|---------------|-------------------|------------|
| Puerto | 4200 | 4201 |
| Keycloak Client | segar-frontend | segar-backoffice |
| Usuario objetivo | Empleados de empresas | Administradores SaaS |
| Funcionalidad | Gestión de trámites | Administración del sistema |

## 📚 Próximas Funcionalidades

- [ ] Gestión completa de usuarios
- [ ] Gestión de empresas y clientes
- [ ] Dashboard con métricas en tiempo real
- [ ] Configuración global del sistema
- [ ] Gestión de notificaciones
- [ ] Logs y auditoría del sistema
- [ ] Reportes avanzados
- [ ] Gestión de planes y facturación

## 👥 Contacto y Soporte

Para soporte o consultas:
- Email: soporte@segar.com
- Tel: +57 300 123 4567

## 📄 Licencia

Copyright © 2025 SEGAR. Todos los derechos reservados.

