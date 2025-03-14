import { Injectable, OnDestroy, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NotificationService } from "./notification.service";
import { Notification } from "../models/notification.interface";


@Injectable({
  providedIn: 'root'
})
export class EchoService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private notificationService = inject(NotificationService);
  connectSSE() {
    if (this.eventSource) {
      return;
    }
    this.eventSource = new EventSource(`http://localhost:8088/api/sse?user_id=${localStorage.getItem('user_id')}`, {
      withCredentials: false
    });

    this.eventSource.addEventListener('notification', (event) => {
      try {
        console.log('Notification received:', event.data);
        const notification = JSON.parse(event.data);
        this.notificationService.notifications.set(notification.notifications);
      } catch (e) {
        console.error('Error parsing notification:', e);
      }
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource?.close();
      this.eventSource = null;
      this.reconnect();
    };
  }

  private reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connectSSE();
    }, 1000);
  }

  ngOnDestroy() {
    this.eventSource?.close();

  }
}