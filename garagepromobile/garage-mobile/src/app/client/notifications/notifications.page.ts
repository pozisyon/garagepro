import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { UserService, User } from '../../core/services/user';
import {
  NotificationService,
  AppNotification
} from '../../core/services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  currentUser!: User;
  notifications: AppNotification[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ionViewWillEnter(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;

    this.userService.getMe().subscribe({
      next: user => {
        this.currentUser = user;

        this.notificationService.getByUser(user.id).subscribe({
          next: data => {
            this.notifications = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.showToast('Erreur chargement notifications');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.showToast('Utilisateur introuvable');
      }
    });
  }

  markAsRead(notification: AppNotification): void {
    if (notification.readStatus) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: updated => {
        notification.readStatus = updated.readStatus;
      },
      error: () => this.showToast('Erreur mise à jour notification')
    });
  }

  markAllAsRead(): void {
    if (!this.currentUser?.id) return;

    this.notificationService.markAllAsRead(this.currentUser.id).subscribe({
      next: () => {
        this.notifications.forEach(n => n.readStatus = true);
        this.showToast('Toutes les notifications sont lues');
      },
      error: () => this.showToast('Erreur mise à jour')
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.readStatus).length;
  }

  getColor(type: string): string {
    switch (type) {
      case 'APPOINTMENT':
        return 'primary';
      case 'REPAIR':
        return 'warning';
      case 'INVOICE':
        return 'success';
      case 'PAYMENT':
        return 'tertiary';
      default:
        return 'medium';
    }
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }
}
