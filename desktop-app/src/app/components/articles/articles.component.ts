import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.interface';
import { ArticleComment } from '../../models/comment.interface';
import { Observer } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AddArticleComponent } from '../add-article/add-article.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AddArticleComponent],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
  
  
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  // Define specific type for newComments
  newComments: Record<number, string> = {};
  replyingTo: number | null = null;
  replyContent: string = '';
  articleService: ArticleService = inject(ArticleService);
  

  ngOnInit() {
    this.articleService.getArticles().pipe(untilDestroyed(this)).subscribe({
      next: (articles) => {
        this.articles = articles;
      },
      error: (error) => console.error('Error fetching articles:', error)
    });
  }

  
}