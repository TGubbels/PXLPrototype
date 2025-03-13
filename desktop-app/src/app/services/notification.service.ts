import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8088/api';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications = signal<Notification[]>([]);

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
   
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      tap((notifications) => this.notifications.set(notifications))
    );
  }
}