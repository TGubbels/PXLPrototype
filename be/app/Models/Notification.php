<?php

namespace App\Models;

use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'article_id',
        'type',
        'content'
    ];

    protected $casts = [
        'type' => NotificationType::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }


    public static function createNotification($articleId, NotificationType $type, $userId = null, $content = null)
    {
        return self::create([
            'user_id' => $userId,
            'article_id' => $articleId,
            'type' => $type,
            'content' => $content
        ]);
    }
}
