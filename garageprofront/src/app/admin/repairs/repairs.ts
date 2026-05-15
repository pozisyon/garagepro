import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepairService, Repair } from '../../core/services/repair';
import { AppointmentService, Appointment } from '../../core/services/appointment';
import { UserService, User } from '../../core/services/user';

@Component({
  selector: 'app-admin-repairs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repairs.html',
  styleUrl: './repairs.scss'
})
export class AdminRepairs implements OnInit {

  repairs: Repair[] = [];
  appointments: Appointment[] = [];
  mechanics: User[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  selectedAppointmentId: number | null = null;
  selectedMechanicId: number | null = null;
  editingRepairId: number | null = null;

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
    private repairService: RepairService,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.repairService.getAll().subscribe({
      next: data => {
        this.repairs = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement réparations';
        this.loading = false;
      }
    });

    this.appointmentService.getAll().subscribe({
      next: data => {
        this.appointments = data.filter(a =>
          a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS'
        );
      }
    });

    this.userService.getAll().subscribe({
      next: users => {
        this.mechanics = users.filter(u => u.role === 'MECHANIC');
      }
    });
  }

  saveRepair(): void {
    if (this.editingRepairId) {
      this.repairService.update(this.editingRepairId, this.form).subscribe({
        next: () => {
          this.success = 'Réparation modifiée avec succès';
          this.resetForm();
          this.loadData();
        },
        error: () => this.error = 'Erreur lors de la modification'
      });

      return;
    }

    if (!this.selectedAppointmentId || !this.selectedMechanicId) {
      this.error = 'Veuillez sélectionner un rendez-vous et un mécanicien';
      return;
    }

    this.repairService
      .createFromAppointment(
        Number(this.selectedAppointmentId),
        Number(this.selectedMechanicId),
        this.form
      )
      .subscribe({
        next: () => {
          this.success = 'Réparation créée avec succès';
          this.resetForm();
          this.loadData();
        },
        error: () => this.error = 'Erreur lors de la création'
      });
  }

  editRepair(repair: Repair): void {
    this.editingRepairId = repair.id || null;

    this.form = {
      diagnosis: repair.diagnosis,
      workDescription: repair.workDescription,
      partsUsed: repair.partsUsed,
      laborCost: repair.laborCost,
      partsCost: repair.partsCost,
      status: repair.status
    };
  }

  changeStatus(repair: Repair, status: string): void {
    if (!repair.id) return;

    this.repairService.updateStatus(repair.id, status).subscribe({
      next: updated => repair.status = <string>updated.status,
      error: () => this.error = 'Erreur lors du changement de statut'
    });
  }

  deleteRepair(id?: number): void {
    if (!id) return;
    if (!confirm('Supprimer cette réparation ?')) return;

    this.repairService.delete(id).subscribe({
      next: () => this.repairs = this.repairs.filter(r => r.id !== id),
      error: () => this.error = 'Erreur lors de la suppression'
    });
  }

  resetForm(): void {
    this.selectedAppointmentId = null;
    this.selectedMechanicId = null;
    this.editingRepairId = null;

    this.form = {
      diagnosis: '',
      workDescription: '',
      partsUsed: '',
      laborCost: 0,
      partsCost: 0
    };
  }
}
