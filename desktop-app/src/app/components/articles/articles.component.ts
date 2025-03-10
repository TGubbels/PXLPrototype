// src/app/components/articles/articles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.interface';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="articles-container">
      <h2>Articles</h2>
      <div class="articles-grid">
        <div *ngFor="let article of articles" class="article-card">
          <h3>{{article.title}}</h3>
          <p>{{article.content}}</p>
          <small>Created: {{article.created_at | date}}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .articles-container {
      padding: 20px;
    }
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .article-card {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  `]
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (articles) => this.articles = articles,
      error: (error) => console.error('Error fetching articles:', error)
    });
  }
}