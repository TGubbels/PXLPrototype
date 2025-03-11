<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::routes(['middleware' => ['auth:sanctum']]);
Broadcast::channel('notifications', function ($user) {
    Log::info("User: ", [$user]);
    return true;
});
Broadcast::channel('notifications.user.{userId}', function ($user, $userId) {
    Log::info("User: ", [$user]);
    return (int) $user->id === (int) $userId;
});


