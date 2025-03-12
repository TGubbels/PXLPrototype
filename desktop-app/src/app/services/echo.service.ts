import { Injectable, OnDestroy, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NotificationService } from "./notification.service";
import { Notification } from "../models/notification.interface";

@Injectable({
  providedIn: 'root'
})
export class EchoService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private lastHeartbeat: number = Date.now();
  private heartbeatInterval: number = 30000; // 30 seconds
  private heartbeatTimer: any;
  private notificationService = inject(NotificationService);

  connectSSE() {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource('http://localhost:8088/sse', {
      withCredentials: false
    });

    this.eventSource.addEventListener('heartbeat', (event) => {
      this.lastHeartbeat = Date.now();
      console.log('Heartbeat received');
    });

    this.eventSource.addEventListener('notification', (event) => {
      try {
        console.log('Notification received:', event.data);
        const notification = JSON.parse(event.data);
        const currentNotifications = this.notificationService.notifications();
        this.notificationService.notifications.set(notification.notifications);
      } catch (e) {
        console.error('Error parsing notification:', e);
      }
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE message:', data);
      } catch (e) {
        console.error('Error parsing SSE message:', e);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource?.close();
      this.eventSource = null;
      this.reconnect();
    };

    this.startHeartbeatMonitoring();
  }

  private startHeartbeatMonitoring() {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      if (now - this.lastHeartbeat > this.heartbeatInterval) {
        console.log('No heartbeat received, reconnecting...');
        this.eventSource?.close();
        this.eventSource = null;
        this.reconnect();
      }
    }, this.heartbeatInterval);
  }

  private reconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connectSSE();
    }, 1000);
  }

  ngOnDestroy() {
    this.eventSource?.close();
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
  }
}