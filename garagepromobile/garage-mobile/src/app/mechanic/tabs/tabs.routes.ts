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
        path: 'repairs',
        loadComponent: () =>
          import('../repairs/repairs.page')
            .then(m => m.RepairsPage)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../notifications/notifications.page')
            .then(m => m.NotificationsPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
