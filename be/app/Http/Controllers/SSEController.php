<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SSEController extends Controller
{
    public function stream(Request $request): StreamedResponse
    {
        // Set the maximum execution time to unlimited
        set_time_limit(0);

        $response = new StreamedResponse(function () {
            $lastNotificationId = null;

            while (true) {
                $query = Notification::query();

                if ($lastNotificationId) {
                    $query->where('id', '>', $lastNotificationId);
                }

                $notifications = $query->get();

                if ($notifications->isNotEmpty()) {
                    $lastNotificationId = $notifications->last()->id;

                    echo "event: notification\n";
                    echo "data: " . json_encode(['notifications' => $notifications]) . "\n\n";
                    flush();
                }

                // Send heartbeat every 25 seconds
                echo "event: heartbeat\n";
                echo "data: " . json_encode(['type' => 'heartbeat']) . "\n\n";
                flush();

                if (connection_aborted()) {
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
