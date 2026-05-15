import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService, Vehicle } from '../../core/services/vehicle';
import { UserService, User } from '../../core/services/user';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss'
})
export class AdminVehicles implements OnInit {

  vehicles: Vehicle[] = [];
  clients: User[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  selectedOwnerId: number | null = null;
  editingId: number | null = null;

  form = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    mileage: 0
  };

  constructor(
    private vehicleService: VehicleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.vehicleService.getAll().subscribe({
      next: data => {
        this.vehicles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement véhicules';
        this.loading = false;
      }
    });

    this.userService.getAll().subscribe({
      next: users => {
        this.clients = users.filter(u => u.role === 'CLIENT');
      }
    });
  }

  saveVehicle(): void {
    if (!this.selectedOwnerId && !this.editingId) {
      this.error = 'Veuillez sélectionner un client propriétaire';
      return;
    }

    if (this.editingId) {
      this.vehicleService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.success = 'Véhicule modifié avec succès';
          this.resetForm();
          this.loadData();
        },
        error: () => this.error = 'Erreur lors de la modification'
      });

      return;
    }

    this.vehicleService.create(Number(this.selectedOwnerId), this.form).subscribe({
      next: () => {
        this.success = 'Véhicule ajouté avec succès';
        this.resetForm();
        this.loadData();
      },
      error: () => this.error = 'Erreur lors de l’ajout du véhicule'
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.editingId = vehicle.id;
    this.selectedOwnerId = vehicle.owner?.id || null;

    this.form = {
      brand: vehicle.brand,
      model: vehicle.model,
      year: (vehicle as any).year,
      plateNumber: vehicle.plateNumber,
      mileage: (vehicle as any).mileage
    };
  }

  deleteVehicle(id: number): void {
    if (!confirm('Supprimer ce véhicule ?')) return;

    this.vehicleService.delete(id).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
      },
      error: () => this.error = 'Erreur lors de la suppression'
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.selectedOwnerId = null;

    this.form = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      mileage: 0
    };
  }
}
