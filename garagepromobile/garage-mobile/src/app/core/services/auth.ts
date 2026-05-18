// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'MECHANIC';
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  async saveSession(response: AuthResponse): Promise<void> {
    await this.storage.set('token', response.token);
    await this.storage.set('role', response.role);
    await this.storage.set('email', response.email);
    await this.storage.set('fullName', response.fullName);
  }

  async logout(): Promise<void> {
    await this.storage.clear();
  }

}
