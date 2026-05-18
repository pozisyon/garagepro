import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/dashboard.page')
            .then(m => m.DashboardPage)
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('../vehicles/vehicles.page')
            .then(m => m.VehiclesPage)
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('../appointments/appointments.page')
            .then(m => m.AppointmentsPage)
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('../invoices/invoices.page')
            .then(m => m.InvoicesPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../notifications/notifications.page')
            .then(m => m.NotificationsPage)
      }
    ]
  }
];
