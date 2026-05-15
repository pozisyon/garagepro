import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';

import { AdminDashboard} from './admin/dashboard/dashboard';
import { AdminAppointments } from './admin/appointments/appointments';
import { AdminVehicles } from './admin/vehicles/vehicles';
import { AdminRepairs } from './admin/repairs/repairs';
import { AdminInvoices } from './admin/invoices/invoices';

import { ClientDashboard } from './client/dashboard/dashboard';
import { ClientVehicles } from './client/vehicles/vehicles';
import { ClientAppointments} from './client/appointments/appointments';
import { ClientInvoices } from './client/invoices/invoices';

import { MechanicDashboard } from './mechanic/dashboard/dashboard';
import { MechanicRepairs} from './mechanic/repairs/repairs';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import {MainLayoutComponent} from './layout/main-layout/main-layout';
export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: Register
  },

{

  path: '',
    component: MainLayoutComponent,
  canActivate: [authGuard],
  children: [
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/appointments',
    component: AdminAppointments,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/vehicles',
    component: AdminVehicles,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/repairs',
    component: AdminRepairs,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/invoices',
    component: AdminInvoices,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },

  {
    path: 'client/dashboard',
    component: ClientDashboard,
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] }
  },
  {
    path: 'client/vehicles',
    component: ClientVehicles,
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] }
  },
  {
    path: 'client/appointments',
    component: ClientAppointments,
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] }
  },
  {
    path: 'client/invoices',
    component: ClientInvoices,
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] }
  },

  {
    path: 'mechanic/dashboard',
    component: MechanicDashboard,
    canActivate: [roleGuard],
    data: { roles: ['MECHANIC'] }
  },
  {
    path: 'mechanic/repairs',
    component: MechanicRepairs,
    canActivate: [roleGuard],
    data: { roles: ['MECHANIC'] }
  }
]
}
];

/*export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/appointments', component: AdminAppointments},
  { path: 'admin/vehicles', component: AdminVehicles },
  { path: 'admin/repairs', component: AdminRepairs },
  { path: 'admin/invoices', component: AdminInvoices },

  { path: 'client/dashboard', component: ClientDashboard },
  { path: 'client/vehicles', component: ClientVehicles },
  { path: 'client/appointments', component: ClientAppointments },
  { path: 'client/invoices', component: ClientInvoices },

  { path: 'mechanic/dashboard', component: MechanicDashboard },
  { path: 'mechanic/repairs', component: MechanicRepairs },

  { path: '**', redirectTo: 'login' }
];
*/
