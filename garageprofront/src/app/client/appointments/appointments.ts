import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user';
import { VehicleService, Vehicle } from '../../core/services/vehicle';
import { AppointmentService, Appointment } from '../../core/services/appointment';

@Component({
  selector: 'app-client-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class ClientAppointments implements OnInit {

  currentUser!: User;
  vehicles: Vehicle[] = [];
  appointments: Appointment[] = [];

  selectedVehicleId: number | null = null;

  form: Appointment = {
    appointmentDate: '',
    serviceType: '',
    description: ''
  };

  success: string | null = null;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;
      this.loadData();
    });
  }

  loadData(): void {
    this.vehicleService.getByOwner(this.currentUser.id).subscribe(v => this.vehicles = v);
    this.appointmentService.getByClient(this.currentUser.id).subscribe(a => this.appointments = a);
  }

  createAppointment(): void {
    if (!this.selectedVehicleId) {
      this.error = 'Veuillez sélectionner un véhicule';
      return;
    }

    this.appointmentService
      .create(this.currentUser.id, Number(this.selectedVehicleId), this.form)
      .subscribe({
        next: () => {
          this.success = 'Demande de rendez-vous envoyée';
          this.error = null;
          this.form = { appointmentDate: '', serviceType: '', description: '' };
          this.selectedVehicleId = null;
          this.loadData();
        },
        error: () => {
          this.error = 'Erreur lors de la demande';
          this.success = null;
        }
      });
  }
}
