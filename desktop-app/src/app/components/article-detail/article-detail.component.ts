import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.interface';
import { ArticleComment } from '../../models/comment.interface';
import { CommentComponent } from '../comment/comment.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article?: Article;
  newComment: string = '';
  replyingTo: number | null = null;
  replyContent: string = '';
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  
  

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id).subscribe({
      next: (article) => this.article = article,
      error: (error) => console.error('Error fetching article:', error)
    });
  }
  onCommentAdded(newComment: ArticleComment) {
    if (this.article) {
      // Create a new reference for the article to trigger change detection
      this.article = {
        ...this.article,
        comments: [...this.article.comments, newComment]
      };
    }
  }
  // Move all the comment methods from ArticlesComponent here
  addComment() {
    if (!this.article || !this.newComment) return;
  
    this.articleService.addComment(this.article.id, this.newComment).subscribe({
      next: (comment) => {
        if (this.article) {
          // Create new array reference to trigger change detection
          this.article = {
            ...this.article,
            comments: [...this.article.comments, comment]
          };
          this.newComment = '';
        }
      },
      error: (error) => console.error('Error adding comment:', error)
    });
  }
  
  
  getParentComments(comments: ArticleComment[]): ArticleComment[] {
    return comments.filter(comment => !comment.parent_id);
  }

  
}