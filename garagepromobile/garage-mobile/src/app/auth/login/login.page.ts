import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.showToast('Veuillez remplir tous les champs');
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: async response => {
        await this.authService.saveSession(response);

        if (response.role === 'MECHANIC') {
          this.router.navigateByUrl('/mechanic/dashboard', { replaceUrl: true });
        } else if (response.role === 'CLIENT') {
          this.router.navigateByUrl('/client/dashboard', { replaceUrl: true });
        } else {
          this.showToast('L’espace admin est disponible sur la version web');
        }

        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Email ou mot de passe incorrect');
      }
    });
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await toast.present();
  }
}
