import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environnement';

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  mileage:number;
  owner?: any;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:8080/api/vehicles';
  private apiUrl = `${environment.apiUrl}/vehicles`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }
  create(ownerId: number, data: any) {
    return this.http.post<Vehicle>(`${this.apiUrl}/owner/${ownerId}`, data);
  }

  update(id: number, data: any) {
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getByOwner(ownerId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/owner/${ownerId}`);
  }


}
