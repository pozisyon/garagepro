import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../core/services/appointment';
import { VehicleService, Vehicle } from '../../core/services/vehicle';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class AdminAppointments implements OnInit {

  appointments: Appointment[] = [];
  vehicles: Vehicle[] = [];

  loading = false;
  error: string | null = null;
  success: string | null = null;

  selectedVehicleId: number | null = null;

  form: Appointment = {
    appointmentDate: '',
    serviceType: '',
    description: ''
  };

  statuses = [
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
  ];

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.appointmentService.getAll().subscribe({
      next: data => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement des rendez-vous';
        this.loading = false;
      }
    });

    this.vehicleService.getAll().subscribe({
      next: data => {
        this.vehicles = data;
      }
    });
  }

  createAppointment(): void {
    if (!this.selectedVehicleId) {
      this.error = 'Veuillez sélectionner un véhicule';
      return;
    }

    const vehicle = this.vehicles.find(v => v.id === Number(this.selectedVehicleId));

    if (!vehicle?.owner?.id) {
      this.error = 'Le véhicule sélectionné n’a pas de client associé';
      return;
    }

    this.appointmentService
      .create(vehicle.owner.id, Number(this.selectedVehicleId), this.form)
      .subscribe({
        next: () => {
          this.success = 'Rendez-vous créé avec succès';
          this.error = null;
          this.resetForm();
          this.loadData();
        },
        error: () => {
          this.error = 'Erreur lors de la création du rendez-vous';
          this.success = null;
        }
      });
  }

  changeStatus(appointment: Appointment, status: string): void {
    if (!appointment.id) return;

    this.appointmentService.updateStatus(appointment.id, status).subscribe({
      next: updated => {
        appointment.status = <string>updated.status;
      },
      error: () => {
        this.error = 'Erreur lors du changement de statut';
      }
    });
  }

  deleteAppointment(id?: number): void {
    if (!id) return;

    if (!confirm('Supprimer ce rendez-vous ?')) {
      return;
    }

    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a.id !== id);
      },
      error: () => {
        this.error = 'Erreur lors de la suppression';
      }
    });
  }

  resetForm(): void {
    this.selectedVehicleId = null;
    this.form = {
      appointmentDate: '',
      serviceType: '',
      description: ''
    };
  }
}
