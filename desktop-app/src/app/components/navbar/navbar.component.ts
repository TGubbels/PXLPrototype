// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-links">
        <a routerLink="/dashboard" [class.active]="isActive('/dashboard')">Dashboard</a>
        <a *ngIf="!(authService.isAuthenticated() | async)" routerLink="/login" [class.active]="isActive('/login')">Login</a>
        <a *ngIf="authService.isAuthenticated() | async" (click)="logout()" style="cursor: pointer;">Logout</a>
      </div>
    </nav>
  `,
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