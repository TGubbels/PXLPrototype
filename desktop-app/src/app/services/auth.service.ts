import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/api';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private http: HttpClient = inject(HttpClient);
  userName: string | null = localStorage.getItem('user_name') ;

  constructor() {
    this.isAuthenticatedSubject.next(!!this.getToken());
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          console.log(response);
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.isAuthenticatedSubject.next(true);
          };
          if(response.user_name){
            localStorage.setItem('user_name', response.user_name);
          }
          if(response.user_id){
            localStorage.setItem('user_id', response.user_id);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}