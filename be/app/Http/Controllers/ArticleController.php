<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with(['user', 'comments.user'])->get();
        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string'
        ]);

        $article = new Article($validated);
        $article->user()->associate($request->user());
        $article->save();

        return response()->json($article, 201);
    }

    public function show(Article $article)
    {
        return response()->json($article->load(['user', 'comments.user']));
    }

    public function update(Request $request, Article $article)
    {
        if ($article->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string'
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    public function destroy(Request $request, Article $article)
    {
        if ($article->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted']);
    }
}
