// src/app/models/notification.interface.ts
export enum NotificationType {
    NEW_ARTICLE = 'new_article',
    REPLY_TO_COMMENT = 'reply_to_comment'
  }
  
  export interface Notification {
    id: number;
    user_id: number;
    article_id: number;
    type: NotificationType;
    content?: string;
    created_at: string;
  }