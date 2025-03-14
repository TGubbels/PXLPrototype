
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'articles',
    loadComponent: () => import('./components/articles/articles.component')
      .then(m => m.ArticlesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./components/article-detail/article-detail.component')
      .then(m => m.ArticleDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./components/notifications/notification-list/notification-list.component')
      .then(m => m.NotificationListComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];