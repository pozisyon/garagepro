/*import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./client/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./client/vehicles/vehicles.page').then( m => m.VehiclesPage)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./client/appointments/appointments.page').then( m => m.AppointmentsPage)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./client/invoices/invoices.page').then( m => m.InvoicesPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./mechanic/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'repairs',
    loadComponent: () => import('./mechanic/repairs/repairs.page').then( m => m.RepairsPage)
  },
];
*/
import { Routes } from '@angular/router';
import { LoginPage } from './auth/login/login.page';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginPage },

  {
    path: 'client/dashboard',
    loadComponent: () =>
      import('./client/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'mechanic/dashboard',
    loadComponent: () =>
      import('./mechanic/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./client/tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./client/tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./client/notifications/notifications.page').then( m => m.NotificationsPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./mechanic/tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: 'mechanic',
    loadChildren: () =>
      import('./mechanic/tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./mechanic/notifications/notifications.page').then( m => m.NotificationsPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./mechanic/notifications/notifications.page').then( m => m.NotificationsPage)
  },
];
