import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user';
import { VehicleService, Vehicle } from '../../core/services/vehicle';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss']
})
export class VehiclesPage implements OnInit {
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
        },
        error: () => this.loading = false
      });
    });
  }
}
