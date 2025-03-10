<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'article_id' => 'required|exists:articles,id',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $user = auth()->user();

        $comment = Comment::create([
            'content' => $validated['content'],
            'article_id' => $validated['article_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'user_id' => $user->id,
            'user_name' => $user->name
        ]);

        return response()->json($comment->load(['user', 'replies']), 201);
    }

    public function show(Comment $comment): JsonResponse
    {
        return response()->json($comment->load(['user', 'replies.user']));
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
            'user_id' => $user->id,
            'user_name' => $user->name
        ]);

        return response()->json($reply->load(['user']), 201);
    }
}
