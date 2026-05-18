import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Appointment {
  id?: number;
  appointmentDate: string;
  serviceType: string;
  description: string;
  status?: string;
  vehicle?: any;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getByClient(clientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/client/${clientId}`);
  }

  create(clientId: number, vehicleId: number, data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${this.apiUrl}/client/${clientId}/vehicle/${vehicleId}`,
      data
    );
  }
}
