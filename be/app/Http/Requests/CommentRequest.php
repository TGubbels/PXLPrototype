<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string',
            'article_id' => 'required|exists:articles,id',
            'parent_id' => 'nullable|exists:comments,id'
        ];
    }
}
