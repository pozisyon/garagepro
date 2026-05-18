import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environnement';

export interface Repair {
  id?: number;
  diagnosis: string;
  workDescription: string;
  partsUsed: string;
  laborCost: number;
  partsCost: number;
  status?: string;
  vehicle?: any;
  client?: any;
  mechanic?: any;
  appointment?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RepairService {

  //private apiUrl = 'http://localhost:8080/api/repairs';
  private apiUrl = `${environment.apiUrl}/repairs`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Repair[]> {
    return this.http.get<Repair[]>(this.apiUrl);
  }

  createFromAppointment(
    appointmentId: number,
    mechanicId: number,
    data: Repair
  ): Observable<Repair> {
    return this.http.post<Repair>(
      `${this.apiUrl}/appointment/${appointmentId}/mechanic/${mechanicId}`,
      data
    );
  }

  update(id: number, data: Repair): Observable<Repair> {
    return this.http.put<Repair>(`${this.apiUrl}/${id}`, data);
  }

  updateStatus(id: number, status: string): Observable<Repair> {
    return this.http.patch<Repair>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getByMechanic(mechanicId: number) {
    return this.http.get<Repair[]>(`${this.apiUrl}/mechanic/${mechanicId}`);
  }
}
