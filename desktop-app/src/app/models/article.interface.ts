// src/app/models/article.interface.ts
import { ArticleComment } from './comment.interface';

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  comments: ArticleComment[];
}