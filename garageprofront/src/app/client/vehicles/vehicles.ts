import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService, Vehicle } from '../../core/services/vehicle';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-client-vehicles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss'
})
export class ClientVehicles implements OnInit {

  vehicles: Vehicle[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.vehicleService.getByOwner(user.id).subscribe({
        next: data => {
          this.vehicles = data;
          this.loading = false;
        }
      });
    });
  }
}
