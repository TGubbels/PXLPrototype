// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-grid">
        <!-- User Welcome Card -->
        <div class="dashboard-card user-card">
          <i class="material-icons user-icon">account_circle</i>
          <h2>Welcome, {{authService.userName}}!</h2>
          <p>Access and manage your articles and notifications</p>
        </div>

        <!-- Quick Links Card -->
        <div class="dashboard-card links-card">
          <h3>Quick Links</h3>
          <div class="quick-links">
            <a routerLink="/articles" class="quick-link">
              <i class="material-icons">article</i>
              <span>View Articles</span>
            </a>
            <a routerLink="/notifications" class="quick-link">
              <i class="material-icons">notifications</i>
              <span>All Notifications</span>
            </a>
          </div>
        </div>

        <!-- Recent Notifications Card -->
        <div class="dashboard-card notifications-card">
          <h3>Recent Notifications</h3>
          <div class="notifications-preview">
            <div *ngFor="let notification of notifications()" 
                 class="notification-item"
                 [routerLink]="['/articles', notification.article_id]">
              <div class="notification-icon" [ngClass]="notification.type">
                <i class="material-icons">
                  {{notification.type === 'new_article' ? 'article' : 'comment'}}
                </i>
              </div>
              <div class="notification-content">
                <p>
                  <ng-container [ngSwitch]="notification.type">
                    <ng-container *ngSwitchCase="'new_article'">
                      New article has been published
                    </ng-container>
                    <ng-container *ngSwitchCase="'reply_to_comment'">
                      New reply: {{notification.content}}
                    </ng-container>
                  </ng-container>
                </p>
                <small>{{notification.created_at | date}}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-card {
      text-align: center;
      
      .user-icon {
        font-size: 4rem;
        color: #2196F3;
        margin-bottom: 1rem;
      }

      h2 {
        margin: 0;
        color: #333;
      }

      p {
        color: #666;
        margin-top: 0.5rem;
      }
    }

    .links-card {
      h3 {
        color: #333;
        margin-top: 0;
      }

      .quick-links {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .quick-link {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: transform 0.2s;

        &:hover {
          transform: translateX(5px);
          background: #e0e0e0;
        }

        i {
          margin-right: 0.5rem;
          color: #2196F3;
        }
      }
    }

    .notifications-card {
      h3 {
        color: #333;
        margin-top: 0;
      }

      .notifications-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
      }

      .notification-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: translateX(5px);
        }
      }

      .notification-icon {
        margin-right: 1rem;
        padding: 0.5rem;
        border-radius: 50%;
        
        &.new_article {
          background-color: #2196F3;
          color: white;
        }
        
        &.reply_to_comment {
          background-color: #4CAF50;
          color: white;
        }
      }

      .notification-content {
        flex: 1;
        
        p {
          margin: 0;
          color: #333;
        }
        
        small {
          color: #666;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  protected authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  ngOnInit() {
    this.notificationService.getNotifications().pipe(untilDestroyed(this)).subscribe();
  }
}