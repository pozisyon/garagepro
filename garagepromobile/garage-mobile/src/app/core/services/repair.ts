import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Repair {
  id?: number;

  diagnosis: string;
  workDescription: string;
  partsUsed: string;

  laborCost: number;
  partsCost: number;

  status?:
    | 'RECEIVED'
    | 'DIAGNOSIS'
    | 'WAITING_PARTS'
    | 'REPAIRING'
    | 'FINAL_TEST'
    | 'READY'
    | 'DELIVERED';

  startedAt?: string;
  completedAt?: string;

  vehicle?: any;
  client?: any;
  mechanic?: any;
  appointment?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RepairService {

  private apiUrl = `${environment.apiUrl}/repairs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Repair[]> {
    return this.http.get<Repair[]>(this.apiUrl);
  }

  getById(id: number): Observable<Repair> {
    return this.http.get<Repair>(`${this.apiUrl}/${id}`);
  }

  getByMechanic(mechanicId: number): Observable<Repair[]> {
    return this.http.get<Repair[]>(`${this.apiUrl}/mechanic/${mechanicId}`);
  }

  getByClient(clientId: number): Observable<Repair[]> {
    return this.http.get<Repair[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getByVehicle(vehicleId: number): Observable<Repair[]> {
    return this.http.get<Repair[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
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
}
