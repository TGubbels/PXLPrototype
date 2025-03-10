<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Article $article)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = new Comment($validated);
        $comment->user()->associate($request->user());
        $comment->article()->associate($article);
        $comment->save();

        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Request $request, Article $article, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
