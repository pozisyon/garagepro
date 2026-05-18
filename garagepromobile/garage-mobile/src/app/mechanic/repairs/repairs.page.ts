import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService, User } from '../../core/services/user';
import { RepairService, Repair } from '../../core/services/repair';

@Component({
  selector: 'app-mechanic-repairs',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './repairs.page.html',
  styleUrls: ['./repairs.page.scss']
})
export class RepairsPage implements OnInit {

  currentUser!: User;
  repairs: Repair[] = [];
  selectedRepair: Repair | null = null;

  loading = true;

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
    partsCost: 0,
    status: 'RECEIVED'
  };

  constructor(
    private userService: UserService,
    private repairService: RepairService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loadRepairs();
  }

  ionViewWillEnter(): void {
    this.loadRepairs();
  }

  loadRepairs(): void {
    this.loading = true;

    this.userService.getMe().subscribe({
      next: user => {
        this.currentUser = user;

        this.repairService.getByMechanic(user.id).subscribe({
          next: data => {
            this.repairs = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.showToast('Erreur chargement réparations', 'danger');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.showToast('Utilisateur introuvable', 'danger');
      }
    });
  }

  selectRepair(repair: Repair): void {
    this.selectedRepair = repair;

    this.form = {
      diagnosis: repair.diagnosis || '',
      workDescription: repair.workDescription || '',
      partsUsed: repair.partsUsed || '',
      laborCost: repair.laborCost || 0,
      partsCost: repair.partsCost || 0,
      status: repair.status || 'RECEIVED'
    };
  }

  saveRepair(): void {
    if (!this.selectedRepair?.id) {
      return;
    }

    this.repairService.update(this.selectedRepair.id, this.form).subscribe({
      next: () => {
        this.showToast('Réparation mise à jour', 'success');
        this.selectedRepair = null;
        this.loadRepairs();
      },
      error: () => {
        this.showToast('Erreur lors de la mise à jour', 'danger');
      }
    });
  }

  quickStatus(repair: Repair, status: string): void {
    if (!repair.id) return;

    this.repairService.updateStatus(repair.id, status).subscribe({
      next: updated => {
        repair.status = updated.status;
        this.showToast('Statut mis à jour', 'success');
      },
      error: () => {
        this.showToast('Erreur changement statut', 'danger');
      }
    });
  }

  cancelEdit(): void {
    this.selectedRepair = null;
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'RECEIVED':
        return 'medium';
      case 'DIAGNOSIS':
        return 'primary';
      case 'WAITING_PARTS':
        return 'warning';
      case 'REPAIRING':
        return 'tertiary';
      case 'FINAL_TEST':
        return 'secondary';
      case 'READY':
        return 'success';
      case 'DELIVERED':
        return 'dark';
      default:
        return 'medium';
    }
  }

  async showToast(message: string, color: string = 'medium'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      color
    });

    await toast.present();
  }
}
