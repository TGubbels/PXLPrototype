<?php

use App\Http\Controllers\SSEController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});


//Route::get('/sse', function () {
//    header('Content-Type: text/event-stream');
//    header('Cache-Control: no-cache');
//    header('Connection: keep-alive');
//
//    // Manually add CORS headers
//    header("Access-Control-Allow-Origin: *"); // Change to specific origin if needed
//    header("Access-Control-Allow-Methods: GET");
//    header("Access-Control-Allow-Headers: *");
//
//    echo "retry: 5000\n"; // Retry after 5s if disconnected
//
//    while (true) {
//        echo "data: " . json_encode(["message" => "Hello from Laravel!"]) . "\n\n";
//        flush();
//
//        if (connection_aborted()) {
//            \Illuminate\Support\Facades\Log::info("Connection aborted");
//            break;
//        }
//
//        sleep(2);
//    }
//});
require __DIR__.'/auth.php';

