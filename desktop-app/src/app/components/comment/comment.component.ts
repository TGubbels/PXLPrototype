// src/app/components/comment/comment.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleComment } from '../../models/comment.interface';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comment" [class.child-comment]="isChild">
      <p>{{comment.content}}</p>
      <div class="comment-footer">
        <small>Created: {{comment.created_at | date}}</small>
        <button class="reply-btn" (click)="onToggleReply(comment.id)">Reply</button>
      </div>

      <!-- Nested replies -->
      <div class="child-comments" *ngIf="childComments.length > 0">
        <app-comment
          *ngFor="let reply of childComments"
          [comment]="reply"
          [allComments]="allComments"
          [replyingTo]="replyingTo"
          [replyContent]="replyContent"
          [isChild]="true"
          (toggleReply)="onToggleReply($event)"
          (submitReply)="onSubmitReply($event)"
          (cancelReply)="onCancelReply()"
        ></app-comment>
      </div>

      <!-- Reply form -->
      <div *ngIf="replyingTo === comment.id" class="reply-section">
        <textarea 
          [(ngModel)]="replyContent"
          placeholder="Write a reply..."
          rows="2"
        ></textarea>
        <div class="reply-actions">
          <button (click)="onSubmitReply(comment.id)" 
                  [disabled]="!replyContent">
            Submit
          </button>
          <button class="cancel-btn" (click)="onCancelReply()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comment {
      padding: 15px;
      margin: 10px 0;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-left: 3px solid #2196F3;
    }
    .child-comments {
      margin-left: 20px;
      border-left: 1px solid #e0e0e0;
    }
    .child-comment {
      border-left-color: #4CAF50;
      background-color: #f5f5f5;
    }
    /* ... rest of the styles from ArticlesComponent ... */
  `]
})
export class CommentComponent {
  @Input() comment!: ArticleComment;
  @Input() allComments: ArticleComment[] = [];
  @Input() replyingTo: number | null = null;
  @Input() replyContent: string = '';
  @Input() isChild: boolean = false;
  
  @Output() toggleReply = new EventEmitter<number>();
  @Output() submitReply = new EventEmitter<number>();
  @Output() cancelReply = new EventEmitter<void>();

  get childComments(): ArticleComment[] {
    return this.allComments.filter(c => c.parent_id === this.comment.id);
  }

  onToggleReply(commentId: number) {
    this.toggleReply.emit(commentId);
  }

  onSubmitReply(commentId: number) {
    this.submitReply.emit(commentId);
  }

  onCancelReply() {
    this.cancelReply.emit();
  }
}