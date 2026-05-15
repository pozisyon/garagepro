import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user';
import { RepairService, Repair } from '../../core/services/repair';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class MechanicDashboard implements OnInit {

  currentUser!: User;
  repairs: Repair[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;

      this.repairService.getByMechanic(user.id).subscribe({
        next: data => {
          this.repairs = data;
          this.loading = false;
        }
      });
    });
  }

  countByStatus(status: string): number {
    return this.repairs.filter(r => r.status === status).length;
  }
}
