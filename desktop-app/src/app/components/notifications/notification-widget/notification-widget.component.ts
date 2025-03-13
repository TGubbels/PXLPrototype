// src/app/components/notification-widget/notification-widget.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-notification-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `./notification-widget.component.html`,
  styleUrls: [`./notification-widget.component.scss`]
})
export class NotificationWidgetComponent implements OnInit {
  
  isOpen = false;
  protected notificationService: NotificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  
  ngOnInit() {
    this.notificationService.getNotifications()
    .pipe(untilDestroyed(this))
    .subscribe({
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}