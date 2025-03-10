<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'article_id' => 'required|exists:articles,id',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = Comment::create([
            'content' => $validated['content'],
            'article_id' => $validated['article_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'user_id' => auth()->id()
        ]);

        return response()->json($comment->load(['user', 'replies']), 201);
    }

    public function show(Comment $comment): JsonResponse
    {
        return response()->json($comment->load(['user', 'replies.user']));
    }
}
