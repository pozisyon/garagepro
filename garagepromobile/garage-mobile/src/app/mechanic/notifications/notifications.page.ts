import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';

import { UserService, User } from '../../core/services/user';
import {
  NotificationService,
  AppNotification
} from '../../core/services/notification';

@Component({
  selector: 'app-mechanic-notifications',
  standalone: true,
  imports: [CommonModule, IonicModule],
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
            this.showToast('Erreur chargement notifications', 'danger');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.showToast('Utilisateur introuvable', 'danger');
      }
    });
  }

  markAsRead(notification: AppNotification): void {
    if (notification.readStatus) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: updated => {
        notification.readStatus = updated.readStatus;
      },
      error: () => {
        this.showToast('Erreur mise à jour notification', 'danger');
      }
    });
  }

  markAllAsRead(): void {
    if (!this.currentUser?.id) return;

    this.notificationService.markAllAsRead(this.currentUser.id).subscribe({
      next: () => {
        this.notifications.forEach(n => n.readStatus = true);
        this.showToast('Toutes les notifications sont lues', 'success');
      },
      error: () => {
        this.showToast('Erreur mise à jour', 'danger');
      }
    });
  }

  unreadCount(): number {
    return this.notifications.filter(n => !n.readStatus).length;
  }

  getColor(type: string): string {
    switch (type) {
      case 'REPAIR':
        return 'warning';
      case 'APPOINTMENT':
        return 'primary';
      case 'INVOICE':
        return 'success';
      case 'SYSTEM':
        return 'medium';
      default:
        return 'tertiary';
    }
  }

  async showToast(message: string, color: string = 'medium'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      color
    });

    await toast.present();
  }
}
