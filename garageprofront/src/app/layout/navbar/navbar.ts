import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user';
import { NotificationService, AppNotification } from '../../core/services/notification';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  fullName = localStorage.getItem('fullName');
  role = localStorage.getItem('role');

  currentUser!: User;
  notifications: AppNotification[] = [];
  showNotifications = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    this.notificationService.getByUser(this.currentUser.id).subscribe(data => {
      this.notifications = data;
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.readStatus).length;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: AppNotification): void {
    if (notification.readStatus) return;

    this.notificationService.markAsRead(notification.id).subscribe(updated => {
      notification.readStatus = updated.readStatus;
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.currentUser.id).subscribe(() => {
      this.notifications.forEach(n => n.readStatus = true);
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
