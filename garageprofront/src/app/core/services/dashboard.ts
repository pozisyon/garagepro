import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {environment} from './environnement';

export interface DashboardStats {
  appointments: number;
  vehicles: number;
  repairs: number;
  invoices: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //private apiUrl = 'http://localhost:8080/api';
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<DashboardStats> {
    return forkJoin({
      appointments: this.http.get<any[]>(`${this.apiUrl}/appointments`),
      vehicles: this.http.get<any[]>(`${this.apiUrl}/vehicles`),
      repairs: this.http.get<any[]>(`${this.apiUrl}/repairs`),
      invoices: this.http.get<any[]>(`${this.apiUrl}/invoices`)
    }).pipe(
      map(result => ({
        appointments: result.appointments.length,
        vehicles: result.vehicles.length,
        repairs: result.repairs.length,
        invoices: result.invoices.length,
        revenue: result.invoices
          .filter(invoice => invoice.status === 'PAID')
          .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0)
      }))
    );
  }

  getRecentAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }
}
