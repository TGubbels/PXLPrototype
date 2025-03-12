// src/app/services/notification.service.ts
import { inject, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification } from '../models/notification.interface';
import { EchoService } from './echo.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private apiUrl = 'http://localhost:8088/api';
  private echoService: EchoService = inject(EchoService);
  private http: HttpClient = inject(HttpClient);
  notifications = signal<Notification[]>([]);

  constructor() {
    this.getNotifications().subscribe();
    this.connectToWebSockets();
  }



  ngOnDestroy(): void {
    this.echoService.disconnect();
  }

  connectToWebSockets() {
    this.echoService.listenToChannel('notifications', 'NotificationAdded', (notification) => {
      const currentNotifications = this.notifications();
      this.notifications.set([...currentNotifications, notification.notification]);
    });

    this.echoService.listenToChannel(`notifications.user.${localStorage.getItem('user_id')}`, 'NotificationAdded',
      (notification) => {
        const currentNotifications = this.notifications();
        this.notifications.set([...currentNotifications, notification.notification]);
      });
  }


  getNotifications(): Observable<Notification[]> {

    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      tap((notifications) => this.notifications.set(notifications)));
  }
}