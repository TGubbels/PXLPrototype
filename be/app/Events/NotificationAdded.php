<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotificationAdded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Notification $notification;

    /**
     * Create a new event instance.
     */
    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return PrivateChannel
     */
    public function broadcastOn(): PrivateChannel
    {
        if ($this->notification->user_id === null) {
            return new PrivateChannel('notifications');
        } else {

            return new PrivateChannel('notifications.user.' . $this->notification->user_id);
        }
    }

    public function broadcastAs()
    {
        return 'NotificationAdded';
    }
    /**

     * Get the data to broadcast.

     *

     * @return array<string, mixed>

     */
    public function broadcastWith(): array
    {
        return [
            'notification' => $this->notification
        ];
    }

}
