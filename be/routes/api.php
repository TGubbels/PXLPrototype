<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SSEController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/articles/{articleId}/comments', [CommentController::class, 'store']);
    Route::post('/comments/{commentId}/reply', [CommentController::class, 'reply']);
    Route::post('/comments/{commentId}/vote', [CommentController::class, 'vote']);

    Route::get('/notifications', [NotificationController::class, 'index']);
});
Route::get('/sse', [SSEController::class, 'stream']);
