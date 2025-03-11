// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationWidgetComponent } from '../notifications/notification-widget/notification-widget.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationWidgetComponent],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar {
      background-color: #333;
      padding: 1rem;
      color: white;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      margin-right: 1rem;
    }
    .nav-links a:hover {
      color: #ddd;
    }
    .active {
      font-weight: bold;
    }
    .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
}
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }

  logout() {
    this.authService.logout();
  }
}