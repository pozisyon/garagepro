import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environnement';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  subtotal?: number;
  taxAmount?: number;
  total?: number;
  status?: string;
  client?: any;
  repair?: any;
  items: InvoiceItem[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  //private apiUrl = 'http://localhost:8080/api/invoices';
  private apiUrl = `${environment.apiUrl}/invoices`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  createFromRepair(repairId: number, data: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/repair/${repairId}`, data);
  }

  updateStatus(id: number, status: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getByClient(clientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/client/${clientId}`);
  }

  downloadPdf(id: number) {
    return this.http.get(
      `${this.apiUrl}/${id}/pdf`,
      {
        responseType: 'blob'
      }
    );
  }
}
