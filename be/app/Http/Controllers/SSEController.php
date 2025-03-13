<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SSEController extends Controller
{
    public function stream(Request $request): StreamedResponse
    {
        set_time_limit(0);

        $userId = $request->query('user_id');

        $response = new StreamedResponse(function () use ($userId) {
            $lastNotificationId = null;
            $startTime = time();
            $maxDuration = 5; // Close connection after 5 seconds

            while (true) {
                $query =  Notification::where('user_id', $userId)
                    ->orWhereNull('user_id');

                if ($lastNotificationId) {
                    $query->where('id', '>', $lastNotificationId);
                }

                $notifications = $query->get();

                if ($notifications->isNotEmpty() && $lastNotificationId < $notifications->last()->id) {
                    $lastNotificationId = $notifications->last()->id;
                    echo "event: notification\n";
                    echo "data: " . json_encode(['notifications' => $notifications]) . "\n\n";
                    flush();
                }

                if (connection_aborted() || (time() - $startTime) > $maxDuration) {
                    break;
                }

                sleep(5);
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }
}
