import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user';
import { VehicleService, Vehicle } from '../../core/services/vehicle';
import { AppointmentService, Appointment } from '../../core/services/appointment';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss']
})
export class AppointmentsPage implements OnInit {
  currentUser!: User;
  vehicles: Vehicle[] = [];
  appointments: Appointment[] = [];

  selectedVehicleId: number | null = null;

  form: Appointment = {
    appointmentDate: '',
    serviceType: '',
    description: ''
  };

  services = [
    'Diagnostic',
    'Changement d’huile',
    'Freins',
    'Pneus',
    'Moteur',
    'Transmission',
    'Entretien général'
  ];

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;
      this.loadData();
    });
  }

  loadData(): void {
    this.vehicleService.getByOwner(this.currentUser.id)
      .subscribe(v => this.vehicles = v);

    this.appointmentService.getByClient(this.currentUser.id)
      .subscribe(a => this.appointments = a);
  }

  createAppointment(): void {
    if (!this.selectedVehicleId || !this.form.appointmentDate || !this.form.serviceType) {
      this.showToast('Veuillez remplir les champs obligatoires');
      return;
    }

    this.appointmentService
      .create(this.currentUser.id, Number(this.selectedVehicleId), this.form)
      .subscribe({
        next: () => {
          this.showToast('Demande de rendez-vous envoyée');
          this.resetForm();
          this.loadData();
        },
        error: () => this.showToast('Erreur lors de la demande')
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

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom'
    });

    await toast.present();
  }
}
