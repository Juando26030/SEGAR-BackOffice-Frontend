import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthCallbackComponent } from './auth/callback/auth-callback.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { SuperAdminWelcomeComponent } from './pages/admin/super-admin-welcome/super-admin-welcome.component';
import { TenantsListComponent } from './pages/admin/tenants-list/tenants-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'admin/welcome',
    component: SuperAdminWelcomeComponent
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'admin/tenants',
    component: TenantsListComponent
  },
  {
    path: 'admin/users',
    component: TenantsListComponent
  },
  {
    path: 'admin/settings',
    component: TenantsListComponent
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
