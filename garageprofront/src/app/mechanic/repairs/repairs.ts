import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user';
import { RepairService, Repair } from '../../core/services/repair';

@Component({
  selector: 'app-mechanic-repairs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repairs.html',
  styleUrl: './repairs.scss'
})
export class MechanicRepairs implements OnInit {

  currentUser!: User;
  repairs: Repair[] = [];

  selectedRepair: Repair | null = null;

  loading = true;
  success: string | null = null;
  error: string | null = null;

  statuses = [
    'RECEIVED',
    'DIAGNOSIS',
    'WAITING_PARTS',
    'REPAIRING',
    'FINAL_TEST',
    'READY',
    'DELIVERED'
  ];

  form: Repair = {
    diagnosis: '',
    workDescription: '',
    partsUsed: '',
    laborCost: 0,
    partsCost: 0
  };

  constructor(
    private userService: UserService,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;
      this.loadRepairs();
    });
  }

  loadRepairs(): void {
    this.repairService.getByMechanic(this.currentUser.id).subscribe({
      next: data => {
        this.repairs = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement réparations';
        this.loading = false;
      }
    });
  }

  selectRepair(repair: Repair): void {
    this.selectedRepair = repair;

    this.form = {
      diagnosis: repair.diagnosis,
      workDescription: repair.workDescription,
      partsUsed: repair.partsUsed,
      laborCost: repair.laborCost,
      partsCost: repair.partsCost,
      status: repair.status
    };
  }

  saveRepair(): void {
    if (!this.selectedRepair?.id) return;

    this.repairService.update(this.selectedRepair.id, this.form).subscribe({
      next: () => {
        this.success = 'Réparation mise à jour';
        this.error = null;
        this.selectedRepair = null;
        this.loadRepairs();
      },
      error: () => {
        this.error = 'Erreur lors de la mise à jour';
        this.success = null;
      }
    });
  }

  changeStatus(repair: Repair, status: string): void {
    if (!repair.id) return;

    this.repairService.updateStatus(repair.id, status).subscribe({
      next: updated => repair.status = updated.status,
      error: () => this.error = 'Erreur changement statut'
    });
  }

  cancelEdit(): void {
    this.selectedRepair = null;
  }
}
