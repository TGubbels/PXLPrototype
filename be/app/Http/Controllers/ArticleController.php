<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        Log::info('Request made by user:', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'token' => $user->currentAccessToken()->name
        ]);

        $articles = Article::with(['user', 'comments.user:id,name'])->get();

        return response()->json($articles);
    }

    public function show($articleId)
    {
        $article = Article::with(['user', 'comments.user:id,name'])->findOrFail($articleId);
        return response()->json($article);
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
