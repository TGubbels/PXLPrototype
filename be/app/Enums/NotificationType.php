<?php

namespace App\Enums;

enum NotificationType: string
{
    case NEW_ARTICLE = 'new_article';
    case REPLY_TO_COMMENT = 'reply_to_comment';
}
