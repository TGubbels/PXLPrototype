<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create two users
        $user1 = User::create([
            'name' => 'Test User 1',
            'email' => 'test1@example.com',
            'password' => Hash::make('password123')
        ]);

        $user2 = User::create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => Hash::make('password123')
        ]);

        // Create an article by user1
        $article = Article::create([
            'title' => 'Test Article',
            'content' => 'This is a test article content.',
            'user_id' => $user1->id
        ]);

        // Create comments from both users
        Comment::create([
            'content' => 'Great article!',
            'user_id' => $user1->id,
            'article_id' => $article->id
        ]);

        Comment::create([
            'content' => 'Very interesting read!',
            'user_id' => $user2->id,
            'article_id' => $article->id
        ]);
    }
}
