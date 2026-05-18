import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserService, User } from '../../core/services/user';
import { RepairService, Repair } from '../../core/services/repair';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  currentUser!: User;
  repairs: Repair[] = [];

  loading = true;

  constructor(
    private userService: UserService,
    private repairService: RepairService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ionViewWillEnter(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.userService.getMe().subscribe({
      next: user => {
        this.currentUser = user;

        this.repairService.getByMechanic(user.id).subscribe({
          next: data => {
            this.repairs = data;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  countByStatus(status: string): number {
    return this.repairs.filter(r => r.status === status).length;
  }

  getActiveRepairs(): Repair[] {
    return this.repairs.filter(r =>
      r.status !== 'READY' &&
      r.status !== 'DELIVERED'
    );
  }

  goToRepairs(): void {
    this.router.navigateByUrl('/mechanic/repairs');
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

}
