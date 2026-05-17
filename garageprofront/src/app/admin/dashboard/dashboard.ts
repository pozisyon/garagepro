import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../core/services/dashboard';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboard implements OnInit {

  loading = true;
  error: string | null = null;

  stats: DashboardStats = {
    appointments: 0,
    vehicles: 0,
    repairs: 0,
    invoices: 0,
    revenue: 0
  };

  recentAppointments: any[] = [];
 // dashboardService = inject(DashboardService);
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getAdminStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des statistiques';

      }
    });

    this.dashboardService.getRecentAppointments().subscribe({
      next: (appointments) => {
        this.recentAppointments = appointments.slice(0, 5);
        console.log(this.recentAppointments);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des rendez-vous récents';
        console.log(this.error);
        this.loading = false;
      }
    });
  }
}
