// src/app/components/add-article-fab/add-article-fab.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent {
  isModalOpen = false;
  title = '';
  content = '';

  constructor(private articleService: ArticleService) {}

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.title = '';
      this.content = '';
    }
  }

  createArticle() {
    if (!this.title || !this.content) return;

    this.articleService.createArticle(this.title, this.content).subscribe({
      next: () => {
        this.toggleModal();
        window.location.reload(); // Refresh to show new article
      },
      error: (error) => console.error('Error creating article:', error)
    });
  }
}