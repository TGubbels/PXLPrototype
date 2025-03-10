<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    public function store(CommentRequest $request): JsonResponse
    {
        $user = auth()->user();

        $comment = Comment::create([
            'content' => $request->validated()['content'],
            'article_id' => $request->validated()['article_id'],
            'parent_id' => $request->validated()['parent_id'] ?? null,
            'user_id' => $user->id
        ]);

        $comment->load(['user', 'replies']);
        return response()->json($comment, 201);
    }

    public function reply(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $user = $request->user();

        Log::info('Reply attempt by user:', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'parent_comment_id' => $commentId
        ]);

        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $reply = Comment::create([
            'content' => $validated['content'],
            'article_id' => $comment->article_id,
            'parent_id' => $commentId,
            'user_id' => $user->id
        ]);

        $reply->load(['user']);
        return response()->json($reply, 201);
    }
}
