import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.error = null;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.saveSession(response);

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'MECHANIC') {
          this.router.navigate(['/mechanic/dashboard']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
