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
use PhpMqtt\Client\Facades\MQTT;

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
        $notification= Notification::createNotification($event->article->id, NotificationType::NEW_ARTICLE);
        MQTT::publish('notifications.users', json_encode($notification) );

    }


    public function handleReplyToCommentAdded(ReplyToCommentAdded $event)
    {

        $notification = Notification::createNotification(

            $event->reply->article_id,
            NotificationType::REPLY_TO_COMMENT,
            $event->comment_id,
            $event->reply->content
        );
        MQTT::publish('notifications.users.' . $notification->user_id, json_encode($notification) );

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
