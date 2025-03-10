import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.interface';
import { ArticleComment } from '../../models/comment.interface';
import { Observer } from 'rxjs';


@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="articles-container">
      <h2>Articles</h2>
      <div class="articles-list">
        <div *ngFor="let article of articles" class="article-card">
          <div class="article-header">
            <h3>{{article.title}}</h3>
            <small>Created: {{article.created_at | date}}</small>
          </div>
          <p class="article-content">{{article.content}}</p>
          
          <div class="comments-section">
            <h4>Comments</h4>
            <div class="new-comment">
              <textarea 
                [(ngModel)]="newComments[article.id]" 
                placeholder="Write a comment..."
                rows="2"
              ></textarea>
              <button (click)="addComment(article.id)" 
                      [disabled]="!newComments[article.id]">
                Add Comment
              </button>
            </div>
            
            <!-- Parent comments -->
            <div *ngFor="let comment of getParentComments(article.comments)" class="comment">
              <div class="comment-header">
                <span class="user-name">{{comment.user.name}}</span>
                <small>Created: {{comment.created_at | date}}</small>
              </div>
              <p class="comment-content">{{comment.content}}</p>
              <div class="comment-footer">
                <button class="reply-btn" (click)="toggleReply(comment.id)">Reply</button>
              </div>

              <!-- Child comments -->
              <div class="child-comments">
                <div *ngFor="let reply of getChildComments(article.comments, comment.id)" 
                     class="comment child-comment">
                  <div class="comment-header">
                    <span class="user-name">{{reply.user.name}}</span>
                    <small>Created: {{reply.created_at | date}}</small>
                  </div>
                  <p class="comment-content">{{reply.content}}</p>
                  <div class="comment-footer">
                    <button class="reply-btn" (click)="toggleReply(reply.id)">Reply</button>
                  </div>
                  <!-- Add reply section for child comments -->
                  <div *ngIf="replyingTo === reply.id" class="reply-section">
                    <textarea 
                      [(ngModel)]="replyContent" 
                      placeholder="Write a reply..."
                      rows="2"
                    ></textarea>
                    <div class="reply-actions">
                      <button (click)="submitReply(reply.id)" 
                              [disabled]="!replyContent">
                        Submit
                      </button>
                      <button class="cancel-btn" (click)="cancelReply()">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="replyingTo === comment.id" class="reply-section">
                <textarea 
                  [(ngModel)]="replyContent" 
                  placeholder="Write a reply..."
                  rows="2"
                ></textarea>
                <div class="reply-actions">
                  <button (click)="submitReply(comment.id)" 
                          [disabled]="!replyContent">
                    Submit
                  </button>
                  <button class="cancel-btn" (click)="cancelReply()">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .articles-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .articles-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .article-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .article-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .article-content {
      line-height: 1.6;
    }
    .comments-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .new-comment, .reply-section {
      margin: 15px 0;
    }
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 10px;
    }
    .comment {
      padding: 15px;
      margin: 10px 0;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-left: 3px solid #2196F3;
    }
    .comment-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #2196F3;
      color: white;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .reply-btn {
      background-color: transparent;
      color: #2196F3;
      padding: 4px 8px;
    }
    .cancel-btn {
      background-color: #f44336;
      margin-left: 10px;
    }
    .reply-actions {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
    .child-comments {
      margin-left: 20px;
      margin-top: 10px;
    }
    .child-comment {
      border-left-color: #4CAF50;
      background-color: #f5f5f5;
    }
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .user-name {
      font-weight: 500;
      color: #2196F3;
    }
    .comment-content {
      margin: 8px 0;
    }
  `]
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  // Define specific type for newComments
  newComments: Record<number, string> = {};
  replyingTo: number | null = null;
  replyContent: string = '';

  constructor(private articleService: ArticleService) {
    // Initialize newComments in constructor or ngOnInit
    this.newComments = {};
  }

  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        // Initialize comment field for each article
        articles.forEach(article => {
          this.newComments[article.id] = '';
        });
      },
      error: (error) => console.error('Error fetching articles:', error)
    });
  }

  addComment(articleId: number) {
    const content = this.newComments[articleId];
    if (!content) return;

    this.articleService.addComment(articleId, content).subscribe({
      next: (comment) => {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
          // Create new array reference to trigger change detection
          article.comments = [...article.comments, comment];
          this.newComments[articleId] = '';
        }
      },
      error: (error) => console.error('Error adding comment:', error)
    });
}

  toggleReply(commentId: number) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyContent = '';
  }

  submitReply(commentId: number) {
    if (!this.replyContent) return;

    this.articleService.replyToComment(commentId, this.replyContent).subscribe({
      next: (reply) => {
        const article = this.articles.find(a => 
          a.comments.some(c => c.id === commentId)
        );
        if (article) {
          // Create new array reference to trigger change detection
          article.comments = [...article.comments, reply];
          this.replyContent = '';
          this.replyingTo = null;
        }
      },
      error: (error) => console.error('Error adding reply:', error)
    });
}

  cancelReply() {
    this.replyingTo = null;
    this.replyContent = '';
  }

  getParentComments(comments: ArticleComment[]): ArticleComment[] {
    return comments.filter(comment => !comment.parent_id);
  }

  getChildComments(comments: ArticleComment[], parentId: number): ArticleComment[] {
    return comments.filter(comment => comment.parent_id === parentId);
  }
}