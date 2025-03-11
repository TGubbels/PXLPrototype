// src/app/services/notification.service.ts
import { inject, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification } from '../models/notification.interface';
import { EchoService } from './echo.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements  OnDestroy{
  private apiUrl = 'http://localhost:8088/api';
  private echoService: EchoService = inject(EchoService);
  notifications = signal<Notification[]>([]);

  constructor(private http: HttpClient) {
    // Initialize notifications
    this.getNotifications().subscribe();

    // Listen for new notifications
    this.echoService.listenToChannel('notifications', 'NotificationAdded', (notification: Notification) => {
      const currentNotifications = this.notifications();
      this.notifications.set([...currentNotifications, notification]);
      console.log('User-specific notification:', notification);
    });

    // Listen for user-specific notifications
    this.echoService.listenToChannel(`notifications.user.1`, 'NotificationAdded', 
      (notification: Notification) => {
        const currentNotifications = this.notifications();
        this.notifications.set([...currentNotifications, notification]);
        console.log('User-specific notification:', notification);
    });
  }

  ngOnDestroy(): void {
    this.echoService.disconnect();
  }
  

  getNotifications(): Observable<Notification[]> {
    
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      tap((notifications) => this.notifications.set( notifications)));
  }
}