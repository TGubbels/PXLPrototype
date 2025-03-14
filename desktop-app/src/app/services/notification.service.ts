// src/app/services/notification.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { Notification } from '../models/notification.interface';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { MqttClientService } from './mqtt-client.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8088/api';
  notifications = signal<Notification[]>([]);
  private privateTopic: string = `notifications.users.${localStorage.getItem('user_id')}`;
  private publicTopic: string = `notifications.users`;


  constructor(private http: HttpClient, private mqttClientService: MqttClientService) {
    this.doSubscriptions();
  }

  doSubscriptions() {
    this.mqttClientService.doSubscribe(this.privateTopic, (notification) => {
      const currentNotifications = this.notifications();
      this.notifications.set([...currentNotifications, notification]);
    });
    this.mqttClientService.doSubscribe(this.publicTopic, (notification) => {
      const currentNotifications = this.notifications();
      this.notifications.set([...currentNotifications, notification]);

    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      tap((notifications) => this.notifications.set(notifications)));
  }



}