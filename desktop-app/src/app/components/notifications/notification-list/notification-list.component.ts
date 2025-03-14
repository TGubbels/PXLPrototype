// src/app/components/notification-list/notification-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification, NotificationType } from '../../../models/notification.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  private notificationService: NotificationService = inject(NotificationService);
  notifications: Notification[] = this.notificationService.notifications();

 

  ngOnInit() {
    
  }
}


