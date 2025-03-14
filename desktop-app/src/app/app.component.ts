import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { IMqttMessage, IMqttServiceOptions, MqttModule, MqttService } from 'ngx-mqtt';
import { IClientSubscribeOptions } from 'mqtt';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    LoginComponent,
    NavbarComponent,


  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private notificationService: NotificationService = inject(NotificationService);
  title = 'desktop-app';
  constructor() {
    console.log()
    if(localStorage.getItem('auth_token')!=null){
      this.notificationService.getNotifications().pipe(untilDestroyed(this)).subscribe(); 

    }
  }

 
}