import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user';
import { VehicleService, Vehicle } from '../../core/services/vehicle';
import { AppointmentService, Appointment } from '../../core/services/appointment';
import { InvoiceService, Invoice } from '../../core/services/invoice';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class ClientDashboard implements OnInit {

  currentUser!: User;
  vehicles: Vehicle[] = [];
  appointments: Appointment[] = [];
  invoices: Invoice[] = [];

  loading = true;

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: user => {
        this.currentUser = user;
        this.loadClientData(user.id);
      }
    });
  }

  loadClientData(clientId: number): void {
    this.vehicleService.getByOwner(clientId).subscribe(v => this.vehicles = v);
    this.appointmentService.getByClient(clientId).subscribe(a => this.appointments = a);
    this.invoiceService.getByClient(clientId).subscribe({
      next: i => {
        this.invoices = i;
        this.loading = false;
      }
    });
  }

  getUnpaidTotal(): number {
    return this.invoices
      .filter(i => i.status === 'UNPAID')
      .reduce((sum, i) => sum + Number(i.total || 0), 0);
  }
}
