<?php

namespace App\Listeners;

use App\Enums\NotificationType;
use App\Events\ArticleCreated;
use App\Events\ReplyToCommentAdded;
use App\Models\Comment;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Dispatcher;
use Illuminate\Queue\InteractsWithQueue;

class NotificationEventSubscriber
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }
    public function handleArticleCreated(ArticleCreated $event)
    {
        Notification::createNotification($event->article->id, NotificationType::NEW_ARTICLE);
    }


    public function handleReplyToCommentAdded(ReplyToCommentAdded $event)
    {

        Notification::createNotification(

            $event->reply->article_id,
            NotificationType::REPLY_TO_COMMENT,
            $event->user_id,
            $event->reply->content
        );
    }
    /**
     * Handle the event.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(ArticleCreated::class, [$this, 'handleArticleCreated']);
        $events->listen(ReplyToCommentAdded::class, [$this, 'handleReplyToCommentAdded']);
    }
}
