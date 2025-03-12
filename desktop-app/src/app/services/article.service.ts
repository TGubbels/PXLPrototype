// src/app/services/article.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.interface';
import { ArticleComment } from '../models/comment.interface';
import { EchoService } from './echo.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8088/api';
  //private echoService: EchoService = inject(EchoService);
  private notificationService: NotificationService = inject(NotificationService);
  constructor(private http: HttpClient) {
   }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }
  addComment(articleId: number, content: string): Observable<ArticleComment> {
    return this.http.post<ArticleComment>(`${this.apiUrl}/articles/${articleId}/comments`, { content });
  }

  replyToComment(commentId: number, content: string): Observable<ArticleComment> {
    return this.http.post<ArticleComment>(`${this.apiUrl}/comments/${commentId}/reply`, { content });
  }
  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }
  createArticle(title: string, content: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, { title, content });
  }
  
}