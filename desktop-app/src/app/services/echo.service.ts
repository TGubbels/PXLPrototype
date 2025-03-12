import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
@Injectable({
  providedIn: 'root'
})
export class EchoService {

  private echo;
  private pusher;

  constructor() {
    this.pusher = Pusher;
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'ts5gcifgjj7nwm4d2tja',
      wsHost: 'localhost',
      wsPort: '8080',
      wssPort: '8080',
      forceTLS: false,
      encrypted: false,
      enabledTransports: ['ws'],
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          Accept: 'application/json'
        }
      },
      authEndpoint: 'http://localhost:8088/broadcasting/auth'
    });
  }

  listenToChannel(channelName: string, eventName: string, callback: (data: any) => void) {
    this.echo.private(channelName).listen(eventName, (event: any) => {
      callback(event);
    });
  }

  disconnect() {
    this.echo.disconnect();
  }
}
