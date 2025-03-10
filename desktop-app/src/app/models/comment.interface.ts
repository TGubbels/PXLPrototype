import { User } from "./user.interface";

export interface ArticleComment {
    id: number;
    content: string;
    user_id: number;
    article_id: number;
    parent_id?: number | null;
    created_at: string;
    updated_at: string;
    user: User;
  }