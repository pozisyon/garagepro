import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserService, User} from '../../core/services/user';
import {Vehicle, VehicleService} from '../../core/services/vehicle';
import {Appointment, AppointmentService} from '../../core/services/appointment';
import {Invoice, InvoiceService} from '../../core/services/invoice';
import {Router} from "@angular/router";
import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  currentUser!: User;

  vehicles: Vehicle[] = [];
  appointments: Appointment[] = [];
  invoices: Invoice[] = [];

  nextAppointment: Appointment | null = null;
  unpaidTotal = 0;

  loading = true;

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private router: Router,
    private authService: AuthService

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

        this.vehicleService.getByOwner(user.id).subscribe(v => {
          this.vehicles = v;
        });

        this.appointmentService.getByClient(user.id).subscribe(a => {
          this.appointments = a;
          this.nextAppointment = this.findNextAppointment(a);
        });

        this.invoiceService.getByClient(user.id).subscribe({
          next: i => {
            this.invoices = i;
            this.unpaidTotal = this.calculateUnpaidTotal(i);
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  findNextAppointment(appointments: Appointment[]): Appointment | null {
    const now = new Date();

    const futureAppointments = appointments
      .filter(a => new Date(a.appointmentDate) >= now)
      .sort((a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
      );

    return futureAppointments.length > 0 ? futureAppointments[0] : null;
  }

  calculateUnpaidTotal(invoices: Invoice[]): number {
    return invoices
      .filter(i => i.status === 'UNPAID')
      .reduce((sum, i) => sum + Number(i.total || 0), 0);
  }

  goToAppointments(): void {
    this.router.navigateByUrl('/client/appointments');
  }

  goToVehicles(): void {
    this.router.navigateByUrl('/client/vehicles');
  }

  goToInvoices(): void {
    this.router.navigateByUrl('/client/invoices');
  }
  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/auth/login', {replaceUrl: true});
  }
}
