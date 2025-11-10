import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthCallbackComponent } from './auth/callback/auth-callback.component';
import { AdminMenuLayoutComponent } from './layout/admin-menu-layout/admin-menu-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { SuperAdminWelcomeComponent } from './pages/admin/super-admin-welcome/super-admin-welcome.component';
import { TenantsListComponent } from './pages/admin/tenants-list/tenants-list.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { BusquedaGlobalComponent } from './pages/admin/busqueda-global/busqueda-global.component';
import { ConfiguracionComponent } from './pages/admin/configuracion/configuracion.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'admin',
    component: AdminMenuLayoutComponent,
    canActivate: [authGuard],
    data: { requireSuperAdmin: true },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'welcome',
        component: SuperAdminWelcomeComponent
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'tenants',
        component: TenantsListComponent
      },
      {
        path: 'busqueda',
        component: BusquedaGlobalComponent
      },
      {
        path: 'settings',
        component: ConfiguracionComponent
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
