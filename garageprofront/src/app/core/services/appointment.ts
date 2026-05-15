import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: number;
  appointmentDate: string;
  serviceType: string;
  description: string;
  status?: string;
  client?: any;
  vehicle?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  create(clientId: number, vehicleId: number, data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${this.apiUrl}/client/${clientId}/vehicle/${vehicleId}`,
      data
    );
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getByClient(clientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/client/${clientId}`);
  }
}
