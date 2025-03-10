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
            'parent_comment_id' => 'nullable|integer|exists:comments,id'
        ];
    }

    public function getContent(bool $asResource = false): string
    {
        return $this->validated()['content'];
    }

    public function getParentCommentId(): ?int
    {
        return $this->validated()['parent_comment_id'] ?? null;
    }
}
