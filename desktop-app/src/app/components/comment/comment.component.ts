import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ArticleComment } from '../../models/comment.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
 
})
export class CommentComponent {
  @Input() comment!: ArticleComment;
  @Input() allComments: ArticleComment[] = [];
  @Input() replyingTo: number | null = null;
  @Input() replyContent: string = '';
  @Input() isChild: boolean = false;
  
  // New Output to emit when comments are updated
  @Output() commentsUpdated = new EventEmitter<ArticleComment>();
  
  constructor(private articleService: ArticleService) {}

  onToggleReply(commentId: number) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyContent = '';
  }

  onSubmitReply(commentId: number) {
    if (!this.replyContent) return;

    this.articleService.replyToComment(commentId, this.replyContent).subscribe({
      next: (reply) => {
        // Emit the new comment to update parent's comment array
        this.commentsUpdated.emit(reply);
        this.replyContent = '';
        this.replyingTo = null;
      },
      error: (error) => console.error('Error adding reply:', error)
    });
  }

  onCancelReply() {
    this.replyingTo = null;
    this.replyContent = '';
  }
  getChildComments(parentId: number): ArticleComment[] {
  // Using allComments array that's passed as Input
  return this.allComments.filter(comment => comment.parent_id === parentId);
}
}