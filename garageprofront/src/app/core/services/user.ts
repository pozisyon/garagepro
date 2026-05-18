import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environnement';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
 // private apiUrl = 'http://localhost:8080/api/users';
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}
